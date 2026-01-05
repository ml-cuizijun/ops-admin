package main

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// CORS 配置
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API 路由组
	api := r.Group("/api")
	{
		// 仪表盘
		api.GET("/dashboard/stats", getDashboardStats)

		// 服务器管理
		server := api.Group("/server")
		{
			server.GET("/list", getServerList)
			server.GET("/monitor", getServerMonitor)
		}

		// K8s 管理
		k8s := api.Group("/k8s")
		{
			k8s.GET("/clusters", getK8sClusters)
			k8s.GET("/deployments", getK8sDeployments)
			k8s.GET("/pods", getK8sPods)
			k8s.GET("/services", getK8sServices)
		}

		// 数据库管理
		database := api.Group("/database")
		{
			database.GET("/mysql", getMySQLInstances)
			database.GET("/redis", getRedisInstances)
		}

		// 部署管理
		deploy := api.Group("/deploy")
		{
			deploy.GET("/projects", getDeployProjects)
			deploy.GET("/history", getDeployHistory)
		}

		// 监控告警
		monitor := api.Group("/monitor")
		{
			monitor.GET("/alerts", getAlerts)
			monitor.GET("/logs", getLogs)
		}

		// 系统管理
		system := api.Group("/system")
		{
			system.GET("/users", getUsers)
			system.GET("/roles", getRoles)
			system.GET("/menus", getMenus)
		}
	}

	r.Run(":8080")
}

// ===== 仪表盘 =====
func getDashboardStats(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": gin.H{
			"serverCount": 1280,
			"k8sCluster":  150,
			"alertCount":  230,
			"deployToday": 560,
		},
	})
}

// ===== 服务器管理 =====
func getServerList(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{
			{"id": 1, "name": "web-01", "ip": "192.168.1.10", "status": "running"},
			{"id": 2, "name": "web-02", "ip": "192.168.1.11", "status": "running"},
			{"id": 3, "name": "db-01", "ip": "192.168.1.20", "status": "running"},
		},
	})
}

func getServerMonitor(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": gin.H{
			"cpu":    65.5,
			"memory": 78.2,
			"disk":   45.0,
		},
	})
}

// ===== K8s 管理 =====
func getK8sClusters(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{
			{"id": 1, "name": "prod-cluster", "version": "1.28", "nodes": 10},
			{"id": 2, "name": "test-cluster", "version": "1.27", "nodes": 3},
		},
	})
}

func getK8sDeployments(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{},
	})
}

func getK8sPods(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{},
	})
}

func getK8sServices(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{},
	})
}

// ===== 数据库管理 =====
func getMySQLInstances(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{
			{"id": 1, "name": "mysql-master", "host": "192.168.1.30", "port": 3306},
		},
	})
}

func getRedisInstances(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{
			{"id": 1, "name": "redis-cluster", "host": "192.168.1.40", "port": 6379},
		},
	})
}

// ===== 部署管理 =====
func getDeployProjects(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{},
	})
}

func getDeployHistory(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{},
	})
}

// ===== 监控告警 =====
func getAlerts(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{},
	})
}

func getLogs(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{},
	})
}

// ===== 系统管理 =====
func getUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{
			{"id": 1, "username": "admin", "nickname": "管理员", "role": "admin"},
		},
	})
}

func getRoles(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{
			{"id": 1, "name": "admin", "description": "超级管理员"},
			{"id": 2, "name": "ops", "description": "运维人员"},
		},
	})
}

func getMenus(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "success",
		"data": []gin.H{},
	})
}
