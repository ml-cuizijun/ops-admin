/**
 * ============================================================================
 * server.js - 服务器管理 API
 * ============================================================================
 *
 * 这个文件定义了与服务器管理相关的所有 API 请求函数
 *
 * 为什么要把 API 单独封装成函数？
 * 1. 代码复用：多个组件可以调用同一个 API
 * 2. 易于维护：API 地址改变时只需改这一处
 * 3. 代码清晰：组件中直接调用函数名，语义明确
 *
 * API 对应关系（前端 → 后端）：
 * - getServerList()      → GET    /api/servers
 * - getServerDetail(id)  → GET    /api/servers/:id
 * - createServer(data)   → POST   /api/servers
 * - updateServer(id,data)→ PUT    /api/servers/:id
 * - deleteServer(id)     → DELETE /api/servers/:id
 */

// ==================== 导入依赖 ====================

// 导入封装好的 axios 实例
// @/ 是 src 目录的别名（在 vite.config.js 中配置）
import request from '@/utils/request'

// ==================== API 函数 ====================

/**
 * 获取服务器列表
 *
 * @returns {Promise} - 返回 Promise，resolve 时包含服务器数组
 *
 * 使用示例：
 * const res = await getServerList()
 * console.log(res.data) // [{ id: 1, name: 'web-01', ... }, ...]
 *
 * 对应后端接口：
 * GET /api/servers
 * 响应：{ code: 0, msg: 'success', data: [...] }
 */
export function getServerList() {
  // request.get() 发送 GET 请求
  // '/servers' 会拼接 baseURL，变成 'http://localhost:8080/api/servers'
  return request.get('/servers')
}

/**
 * 获取服务器详情
 *
 * @param {number|string} id - 服务器 ID
 * @returns {Promise} - 返回 Promise，resolve 时包含单个服务器对象
 *
 * 使用示例：
 * const res = await getServerDetail(1)
 * console.log(res.data) // { id: 1, name: 'web-01', ip: '...', ... }
 *
 * 对应后端接口：
 * GET /api/servers/:id
 */
export function getServerDetail(id) {
  // 模板字符串：用反引号 ` 包裹，${} 插入变量
  // 如果 id = 1，则请求 '/servers/1'
  return request.get(`/servers/${id}`)
}

/**
 * 创建服务器
 *
 * @param {Object} data - 服务器数据对象
 * @param {string} data.name - 服务器名称
 * @param {string} data.ip - IP 地址
 * @param {number} data.port - 端口号
 * @param {string} data.status - 状态
 * @param {number} data.cpu - CPU 使用率
 * @param {number} data.memory - 内存使用率
 * @param {string} data.remark - 备注
 * @returns {Promise} - 返回创建后的服务器对象（包含生成的 ID）
 *
 * 使用示例：
 * const res = await createServer({
 *   name: 'web-01',
 *   ip: '192.168.1.100',
 *   port: 22,
 *   status: 'running'
 * })
 * console.log(res.data.id) // 新创建的服务器 ID
 *
 * 对应后端接口：
 * POST /api/servers
 * 请求体：JSON 格式的服务器数据
 */
export function createServer(data) {
  // request.post(url, data) 发送 POST 请求
  // data 会被自动序列化为 JSON 放在请求体中
  return request.post('/servers', data)
}

/**
 * 更新服务器
 *
 * @param {number|string} id - 要更新的服务器 ID
 * @param {Object} data - 更新的数据（只需包含要更新的字段）
 * @returns {Promise} - 返回更新后的服务器对象
 *
 * 使用示例：
 * await updateServer(1, { name: 'new-name', status: 'stopped' })
 *
 * 对应后端接口：
 * PUT /api/servers/:id
 */
export function updateServer(id, data) {
  // request.put() 发送 PUT 请求
  // RESTful 规范：PUT 用于更新资源
  return request.put(`/servers/${id}`, data)
}

/**
 * 删除服务器
 *
 * @param {number|string} id - 要删除的服务器 ID
 * @returns {Promise} - 返回删除结果
 *
 * 使用示例：
 * await deleteServer(1)
 *
 * 对应后端接口：
 * DELETE /api/servers/:id
 */
export function deleteServer(id) {
  // request.delete() 发送 DELETE 请求
  // RESTful 规范：DELETE 用于删除资源
  return request.delete(`/servers/${id}`)
}
