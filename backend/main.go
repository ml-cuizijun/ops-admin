/*
 * ============================================================================
 * main.go - Go 后端 API 服务
 * ============================================================================
 *
 * 这是运维管理系统的后端服务，提供 RESTful API
 *
 * 技术栈：
 * - Gin: Go 最流行的 Web 框架，类似 Python 的 Flask、Node 的 Express
 * - GORM: Go 最流行的 ORM 库，用于操作数据库
 * - MySQL: 关系型数据库
 *
 * API 接口列表：
 * - GET    /api/servers      获取服务器列表
 * - GET    /api/servers/:id  获取单个服务器详情
 * - POST   /api/servers      创建新服务器
 * - PUT    /api/servers/:id  更新服务器信息
 * - DELETE /api/servers/:id  删除服务器
 *
 * 启动命令：go run main.go
 * 服务地址：http://localhost:8080
 */

package main

import (
	"log"      // 日志包，用于打印日志
	"net/http" // HTTP 包，提供状态码常量
	"time"     // 时间包，用于处理时间

	"github.com/gin-contrib/cors" // CORS 中间件，处理跨域请求
	"github.com/gin-gonic/gin"    // Gin Web 框架
	"gorm.io/driver/mysql"        // GORM 的 MySQL 驱动
	"gorm.io/gorm"                // GORM ORM 库
)

// ============================================================================
// 全局变量
// ============================================================================

/*
 * db: 数据库连接实例（全局变量）
 *
 * 为什么用全局变量？
 * - 数据库连接是昂贵的资源，应该复用
 * - 整个应用只需要一个连接池
 * - 所有 API 处理函数都需要访问数据库
 *
 * *gorm.DB 是指针类型，指向 GORM 的数据库实例
 */
var db *gorm.DB

// ============================================================================
// 数据库初始化
// ============================================================================

/*
 * initDB: 初始化数据库连接
 *
 * 这个函数做了两件事：
 * 1. 连接 MySQL 数据库
 * 2. 自动创建/更新数据表结构（AutoMigrate）
 */
func initDB() {
	/*
	 * DSN (Data Source Name): 数据库连接字符串
	 *
	 * 格式：用户名:密码@tcp(主机:端口)/数据库名?参数
	 *
	 * 参数说明：
	 * - charset=utf8mb4: 使用 UTF-8 编码，支持 emoji
	 * - parseTime=True: 将数据库的时间类型解析为 Go 的 time.Time
	 * - loc=Local: 使用本地时区
	 */
	dsn := "zg:zg2020@tcp(192.168.60.200:3306)/govue?charset=utf8mb4&parseTime=True&loc=Local"

	/*
	 * 连接数据库
	 *
	 * gorm.Open(): 打开数据库连接
	 * - 第一个参数：数据库驱动（这里是 MySQL）
	 * - 第二个参数：GORM 配置
	 *
	 * 返回值：
	 * - db: 数据库实例
	 * - err: 错误信息（如果连接失败）
	 */
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	/*
	 * 错误处理
	 * log.Fatal: 打印错误并退出程序（exit code 1）
	 * 数据库连接失败是致命错误，程序无法继续运行
	 */
	if err != nil {
		log.Fatal("数据库连接失败:", err)
	}
	log.Println("数据库连接成功")

	/*
	 * AutoMigrate: 自动迁移（创建/更新表结构）
	 *
	 * 作用：
	 * - 如果表不存在，自动创建
	 * - 如果表存在但结构不同，自动添加新字段
	 * - 不会删除字段或修改字段类型（安全）
	 *
	 * &Server{}: 传入结构体指针，GORM 会根据结构体定义创建表
	 */
	db.AutoMigrate(&Server{})
	log.Println("数据表迁移完成")
}

// ============================================================================
// 数据模型（Model）
// ============================================================================

/*
 * Server: 服务器模型结构体
 *
 * Go 的结构体（struct）类似其他语言的类（class）
 * 每个字段都有三部分：
 * - 字段名（如 ID）
 * - 数据类型（如 uint）
 * - 标签 tag（反引号内的内容）
 *
 * 标签说明：
 * - json:"xxx": JSON 序列化时使用的字段名
 * - gorm:"xxx": GORM 数据库相关配置
 *
 * GORM 标签详解：
 * - primaryKey: 主键
 * - size:100: 字符串长度
 * - not null: 非空约束
 * - default:xxx: 默认值
 * - comment:xxx: 字段注释（在数据库中显示）
 */
type Server struct {
	// ID: 主键，自增
	// uint: 无符号整数（只能为正数）
	ID uint `json:"id" gorm:"primaryKey"`

	// Name: 服务器名称
	// size:100 表示 VARCHAR(100)
	Name string `json:"name" gorm:"size:100;not null;comment:服务器名称"`

	// IP: IP 地址
	IP string `json:"ip" gorm:"size:50;not null;comment:IP地址"`

	// Port: SSH 端口，默认 22
	Port int `json:"port" gorm:"default:22;comment:SSH端口"`

	// Status: 运行状态，默认 running
	// 可选值：running, stopped, error
	Status string `json:"status" gorm:"size:20;default:running;comment:状态"`

	// CPU: CPU 使用率（百分比）
	CPU int `json:"cpu" gorm:"default:0;comment:CPU使用率"`

	// Memory: 内存使用率（百分比）
	Memory int `json:"memory" gorm:"default:0;comment:内存使用率"`

	// Remark: 备注信息
	Remark string `json:"remark" gorm:"size:500;comment:备注"`

	// CreatedAt: 创建时间
	// GORM 会自动管理这个字段
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt: 更新时间
	// 每次更新记录时，GORM 自动更新这个字段
	UpdatedAt time.Time `json:"updated_at"`
}

// ============================================================================
// 主函数（程序入口）
// ============================================================================

/*
 * main: 程序入口函数
 *
 * Go 程序从 main 包的 main 函数开始执行
 * 这里负责：
 * 1. 初始化数据库
 * 2. 创建 Gin 路由
 * 3. 配置 CORS 跨域
 * 4. 注册 API 路由
 * 5. 启动 HTTP 服务
 */
func main() {
	// 步骤1：初始化数据库连接
	initDB()

	/*
	 * 步骤2：创建 Gin 引擎
	 *
	 * gin.Default() 创建一个带默认中间件的引擎：
	 * - Logger: 请求日志中间件
	 * - Recovery: 异常恢复中间件（panic 时不会崩溃）
	 *
	 * 如果不需要默认中间件，可以用 gin.New()
	 */
	r := gin.Default()

	/*
	 * 步骤3：配置 CORS 跨域
	 *
	 * 什么是跨域？
	 * - 前端运行在 http://localhost:3000
	 * - 后端运行在 http://localhost:8080
	 * - 域名/端口不同，浏览器会阻止请求（安全策略）
	 *
	 * CORS (Cross-Origin Resource Sharing) 跨域资源共享
	 * 通过设置响应头，告诉浏览器允许跨域请求
	 *
	 * r.Use(): 使用中间件
	 * 中间件会在每个请求处理前/后执行
	 */
	r.Use(cors.New(cors.Config{
		// AllowOrigins: 允许的前端域名
		// 生产环境应该设置为具体的域名
		AllowOrigins: []string{"http://localhost:3000"},

		// AllowMethods: 允许的 HTTP 方法
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},

		// AllowHeaders: 允许的请求头
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},

		// AllowCredentials: 是否允许携带凭证（cookies）
		AllowCredentials: true,

		// MaxAge: 预检请求的缓存时间
		// 浏览器在这段时间内不会重复发送 OPTIONS 请求
		MaxAge: 12 * time.Hour,
	}))

	/*
	 * 步骤4：注册 API 路由
	 *
	 * r.Group("/api"): 创建路由组
	 * 路由组的好处：
	 * - 统一的 URL 前缀（/api）
	 * - 可以为组设置统一的中间件
	 *
	 * RESTful API 设计规范：
	 * - GET: 获取资源（查询）
	 * - POST: 创建资源（新增）
	 * - PUT: 更新资源（修改）
	 * - DELETE: 删除资源
	 *
	 * :id 是路径参数，如 /api/servers/1 中的 1
	 */
	api := r.Group("/api")
	{
		// GET /api/servers - 获取服务器列表
		api.GET("/servers", getServerList)

		// GET /api/servers/:id - 获取单个服务器详情
		// :id 是路径参数，可以通过 c.Param("id") 获取
		api.GET("/servers/:id", getServerDetail)

		// POST /api/servers - 创建新服务器
		// 请求体是 JSON 格式的服务器数据
		api.POST("/servers", createServer)

		// PUT /api/servers/:id - 更新服务器
		// :id 指定要更新的服务器，请求体是新数据
		api.PUT("/servers/:id", updateServer)

		// DELETE /api/servers/:id - 删除服务器
		api.DELETE("/servers/:id", deleteServer)

		// POST /api/servers/batch-delete - 批量删除服务器
		// 请求体：{ "ids": [1, 2, 3] }
		api.POST("/servers/batch-delete", batchDeleteServer)
	}

	/*
	 * 步骤5：启动 HTTP 服务
	 *
	 * r.Run(":8080"): 监听 8080 端口
	 * :8080 等价于 0.0.0.0:8080，监听所有网络接口
	 *
	 * 这是一个阻塞调用，程序会一直运行直到被终止
	 */
	log.Println("服务器启动在 :8080")
	r.Run(":8080")
}

// ============================================================================
// API 处理函数（Handler）
// ============================================================================

/*
 * response: 统一响应格式
 *
 * 为什么要统一格式？
 * - 前端处理更方便，知道数据结构是固定的
 * - 便于错误处理和状态判断
 *
 * 响应格式：
 * {
 *   "code": 0,        // 0 表示成功，非 0 表示错误
 *   "msg": "success", // 提示信息
 *   "data": {...}     // 实际数据
 * }
 *
 * 参数说明：
 * - c: Gin 的上下文，包含请求和响应的所有信息
 * - code: 业务状态码
 * - msg: 提示消息
 * - data: 返回数据（可以是任意类型）
 */
func response(c *gin.Context, code int, msg string, data interface{}) {
	/*
	 * c.JSON(): 返回 JSON 响应
	 *
	 * 第一个参数：HTTP 状态码
	 * - http.StatusOK = 200
	 *
	 * 第二个参数：响应数据
	 * - gin.H 是 map[string]interface{} 的简写
	 * - 会自动序列化为 JSON
	 */
	c.JSON(http.StatusOK, gin.H{
		"code": code,
		"msg":  msg,
		"data": data,
	})
}

/*
 * getServerList: 获取服务器列表
 *
 * 请求：GET /api/servers
 * 响应：所有服务器的数组
 */
func getServerList(c *gin.Context) {
	// 声明一个 Server 切片（动态数组）来存储查询结果
	var servers []Server

	/*
	 * GORM 查询
	 *
	 * db.Order("id desc"): 按 ID 降序排列（最新的在前面）
	 * .Find(&servers): 查询所有记录，存入 servers 变量
	 *
	 * &servers 是指针，让 GORM 能修改这个变量
	 */
	result := db.Order("id desc").Find(&servers)

	// 错误处理
	if result.Error != nil {
		response(c, 1, "查询失败: "+result.Error.Error(), nil)
		return // 提前返回，不执行后面的代码
	}

	// 成功响应
	response(c, 0, "success", servers)
}

/*
 * getServerDetail: 获取单个服务器详情
 *
 * 请求：GET /api/servers/:id
 * 响应：单个服务器对象
 */
func getServerDetail(c *gin.Context) {
	/*
	 * c.Param("id"): 获取路径参数
	 *
	 * 如果请求是 /api/servers/5
	 * 那么 id = "5"（字符串类型）
	 */
	id := c.Param("id")

	// 声明变量存储查询结果
	var server Server

	/*
	 * db.First(): 查询第一条匹配的记录
	 *
	 * First(&server, id) 相当于:
	 * SELECT * FROM servers WHERE id = ? LIMIT 1
	 */
	result := db.First(&server, id)

	// 如果没找到记录，result.Error 会是 gorm.ErrRecordNotFound
	if result.Error != nil {
		response(c, 1, "服务器不存在", nil)
		return
	}

	response(c, 0, "success", server)
}

/*
 * createServer: 创建新服务器
 *
 * 请求：POST /api/servers
 * 请求体：{ "name": "web-01", "ip": "192.168.1.1", ... }
 * 响应：创建后的服务器对象（包含 ID 和时间戳）
 */
func createServer(c *gin.Context) {
	var server Server

	/*
	 * c.ShouldBindJSON(): 解析 JSON 请求体
	 *
	 * 将请求体中的 JSON 数据绑定到 server 变量
	 * 如果 JSON 格式错误，会返回 error
	 *
	 * ShouldBindJSON vs BindJSON:
	 * - ShouldBindJSON: 出错时不自动响应，需要手动处理
	 * - BindJSON: 出错时自动响应 400 错误
	 */
	if err := c.ShouldBindJSON(&server); err != nil {
		response(c, 1, "参数错误: "+err.Error(), nil)
		return
	}

	/*
	 * db.Create(): 插入新记录
	 *
	 * GORM 会：
	 * 1. 生成 INSERT 语句
	 * 2. 执行插入
	 * 3. 将数据库生成的 ID 回填到 server.ID
	 * 4. 自动设置 CreatedAt 和 UpdatedAt
	 */
	result := db.Create(&server)

	if result.Error != nil {
		response(c, 1, "创建失败: "+result.Error.Error(), nil)
		return
	}

	// 返回创建后的完整数据（包含 ID）
	response(c, 0, "创建成功", server)
}

/*
 * updateServer: 更新服务器信息
 *
 * 请求：PUT /api/servers/:id
 * 请求体：{ "name": "new-name", ... }
 * 响应：更新后的服务器对象
 */
func updateServer(c *gin.Context) {
	id := c.Param("id")

	// 步骤1：先查询服务器是否存在
	var server Server
	if db.First(&server, id).Error != nil {
		response(c, 1, "服务器不存在", nil)
		return
	}

	// 步骤2：解析请求体中的更新数据
	var updateData Server
	if err := c.ShouldBindJSON(&updateData); err != nil {
		response(c, 1, "参数错误: "+err.Error(), nil)
		return
	}

	/*
	 * 步骤3：执行更新
	 *
	 * db.Model(&server): 指定要更新的记录
	 * .Updates(updateData): 更新字段
	 *
	 * Updates 只会更新非零值字段：
	 * - 如果 updateData.Name = ""，Name 不会被更新
	 * - 如果 updateData.Port = 0，Port 不会被更新
	 *
	 * 如果要更新为零值，可以用 Update("name", "") 单独更新
	 */
	db.Model(&server).Updates(updateData)

	// 重新查询最新数据返回
	db.First(&server, id)
	response(c, 0, "更新成功", server)
}

/*
 * deleteServer: 删除服务器
 *
 * 请求：DELETE /api/servers/:id
 * 响应：成功或失败信息
 */
func deleteServer(c *gin.Context) {
	id := c.Param("id")

	/*
	 * db.Delete(): 删除记录
	 *
	 * Delete(&Server{}, id) 相当于:
	 * DELETE FROM servers WHERE id = ?
	 *
	 * result.RowsAffected: 受影响的行数
	 * - 如果为 0，说明没有找到要删除的记录
	 */
	result := db.Delete(&Server{}, id)

	if result.RowsAffected == 0 {
		response(c, 1, "服务器不存在", nil)
		return
	}

	response(c, 0, "删除成功", nil)
}

/*
 * batchDeleteServer: 批量删除服务器
 *
 * 请求：POST /api/servers/batch-delete
 * 请求体：{ "ids": [1, 2, 3] }
 * 响应：成功删除的数量
 */
func batchDeleteServer(c *gin.Context) {
	/*
	 * 定义请求体结构
	 *
	 * 匿名结构体：只在这个函数内使用，不需要单独定义类型
	 * IDs []uint: 整数数组，存储要删除的 ID 列表
	 * json:"ids": 对应前端传来的 { ids: [1,2,3] }
	 */
	var req struct {
		IDs []uint `json:"ids"`
	}

	// 解析请求体
	if err := c.ShouldBindJSON(&req); err != nil {
		response(c, 1, "参数错误: "+err.Error(), nil)
		return
	}

	// 验证：ID 列表不能为空
	if len(req.IDs) == 0 {
		response(c, 1, "请选择要删除的服务器", nil)
		return
	}

	/*
	 * 批量删除
	 *
	 * db.Delete(&Server{}, req.IDs) 相当于:
	 * DELETE FROM servers WHERE id IN (1, 2, 3)
	 *
	 * GORM 支持传入切片作为条件，自动生成 IN 查询
	 */
	result := db.Delete(&Server{}, req.IDs)

	if result.Error != nil {
		response(c, 1, "删除失败: "+result.Error.Error(), nil)
		return
	}

	// 返回实际删除的数量
	response(c, 0, "删除成功", gin.H{
		"deleted": result.RowsAffected,
	})
}
