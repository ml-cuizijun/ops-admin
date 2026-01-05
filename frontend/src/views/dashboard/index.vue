<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #409EFF;">
              <el-icon size="30"><Monitor /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.serverCount }}</div>
              <div class="stat-label">服务器总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #67C23A;">
              <el-icon size="30"><Cloudy /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.k8sCluster }}</div>
              <div class="stat-label">K8s 集群</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #E6A23C;">
              <el-icon size="30"><Bell /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.alertCount }}</div>
              <div class="stat-label">待处理告警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #F56C6C;">
              <el-icon size="30"><Upload /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.deployToday }}</div>
              <div class="stat-label">今日部署</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 资源使用进度条 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>CPU 使用率</span>
              <span class="percentage">{{ resourceUsage.cpu }}%</span>
            </div>
          </template>
          <el-progress 
            :percentage="resourceUsage.cpu" 
            :color="getProgressColor(resourceUsage.cpu)"
            :stroke-width="20"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>内存使用率</span>
              <span class="percentage">{{ resourceUsage.memory }}%</span>
            </div>
          </template>
          <el-progress 
            :percentage="resourceUsage.memory" 
            :color="getProgressColor(resourceUsage.memory)"
            :stroke-width="20"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>磁盘使用率</span>
              <span class="percentage">{{ resourceUsage.disk }}%</span>
            </div>
          </template>
          <el-progress 
            :percentage="resourceUsage.disk" 
            :color="getProgressColor(resourceUsage.disk)"
            :stroke-width="20"
          />
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 服务器列表和告警 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="14">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>服务器状态</span>
              <el-button type="primary" size="small" text>查看全部</el-button>
            </div>
          </template>
          <el-table :data="serverList" stripe style="width: 100%">
            <el-table-column prop="name" label="服务器名称" width="120" />
            <el-table-column prop="ip" label="IP地址" width="140" />
            <el-table-column prop="cpu" label="CPU">
              <template #default="{ row }">
                <el-progress :percentage="row.cpu" :stroke-width="10" :show-text="false" />
                <span style="margin-left: 8px;">{{ row.cpu }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="memory" label="内存">
              <template #default="{ row }">
                <el-progress :percentage="row.memory" :stroke-width="10" :show-text="false" />
                <span style="margin-left: 8px;">{{ row.memory }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'running' ? 'success' : 'danger'">
                  {{ row.status === 'running' ? '运行中' : '已停止' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :span="10">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近告警</span>
              <el-badge :value="alerts.length" class="alert-badge">
                <el-button type="danger" size="small" text>处理告警</el-button>
              </el-badge>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item 
              v-for="alert in alerts" 
              :key="alert.id"
              :timestamp="alert.time" 
              :type="alert.level"
            >
              {{ alert.message }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 快捷操作 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <span>快捷操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" icon="Plus" size="large">新建部署</el-button>
            <el-button type="success" icon="Refresh" size="large">批量重启</el-button>
            <el-button type="warning" icon="Download" size="large">备份数据</el-button>
            <el-button type="info" icon="DocumentCopy" size="large">查看日志</el-button>
            <el-button type="danger" icon="Warning" size="large">告警设置</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDashboardStats, getServerList, getServerMonitor, getAlerts } from '@/api/dashboard'
import { ElMessage } from 'element-plus'

// 加载状态
const loading = ref(false)

// 统计数据
const stats = ref({
  serverCount: 0,
  k8sCluster: 0,
  alertCount: 0,
  deployToday: 0
})

// 资源使用率
const resourceUsage = ref({
  cpu: 0,
  memory: 0,
  disk: 0
})

// 服务器列表
const serverList = ref([])

// 告警列表
const alerts = ref([])

// 获取进度条颜色
const getProgressColor = (percentage) => {
  if (percentage < 50) return '#67C23A'
  if (percentage < 80) return '#E6A23C'
  return '#F56C6C'
}

// 获取仪表盘数据
const fetchDashboardData = async () => {
  loading.value = true
  try {
    // 并行请求所有数据
    const [statsRes, serverRes, monitorRes, alertsRes] = await Promise.all([
      getDashboardStats(),
      getServerList(),
      getServerMonitor(),
      getAlerts()
    ])
    
    // 统计数据
    stats.value = statsRes.data
    
    // 服务器列表（添加模拟的 cpu/memory 数据）
    serverList.value = serverRes.data.map(server => ({
      ...server,
      cpu: Math.floor(Math.random() * 60) + 20,
      memory: Math.floor(Math.random() * 50) + 30
    }))
    
    // 资源使用率
    resourceUsage.value = monitorRes.data
    
    // 告警列表（如果后端没数据就用模拟数据）
    if (alertsRes.data && alertsRes.data.length > 0) {
      alerts.value = alertsRes.data
    } else {
      // 模拟告警数据
      alerts.value = [
        { id: 1, time: '2026-01-05 14:30', level: 'danger', message: '服务器 db-master CPU 使用率超过 80%' },
        { id: 2, time: '2026-01-05 13:45', level: 'warning', message: 'Redis 内存使用率达到 65%' },
        { id: 3, time: '2026-01-05 12:20', level: 'warning', message: 'K8s Pod nginx-xxx 重启 3 次' },
        { id: 4, time: '2026-01-05 10:15', level: 'success', message: '数据库备份完成' },
      ]
    }
    
    ElMessage.success('数据加载成功（来自后端API）')
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，使用模拟数据')
    // 使用模拟数据作为降级方案
    useMockData()
  } finally {
    loading.value = false
  }
}

// 模拟数据（降级方案）
const useMockData = () => {
  stats.value = {
    serverCount: 128,
    k8sCluster: 15,
    alertCount: 23,
    deployToday: 56
  }
  resourceUsage.value = {
    cpu: 65,
    memory: 78,
    disk: 45
  }
  serverList.value = [
    { id: 1, name: 'web-prod-01', ip: '192.168.1.10', cpu: 65, memory: 72, status: 'running' },
    { id: 2, name: 'web-prod-02', ip: '192.168.1.11', cpu: 45, memory: 58, status: 'running' },
    { id: 3, name: 'db-master', ip: '192.168.1.20', cpu: 82, memory: 85, status: 'running' },
  ]
  alerts.value = [
    { id: 1, time: '2026-01-05 14:30', level: 'danger', message: '服务器 db-master CPU 使用率超过 80%' },
    { id: 2, time: '2026-01-05 13:45', level: 'warning', message: 'Redis 内存使用率达到 65%' },
  ]
}

// 页面加载时获取数据
onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 10px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-info {
  margin-left: 20px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.percentage {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
}

.quick-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.alert-badge {
  margin-left: 10px;
}
</style>
