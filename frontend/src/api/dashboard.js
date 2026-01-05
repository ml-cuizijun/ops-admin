import request from '@/utils/request'

// 获取仪表盘统计数据
export function getDashboardStats() {
  return request.get('/dashboard/stats')
}

// 获取服务器列表
export function getServerList() {
  return request.get('/server/list')
}

// 获取服务器监控数据
export function getServerMonitor() {
  return request.get('/server/monitor')
}

// 获取告警列表
export function getAlerts() {
  return request.get('/monitor/alerts')
}
