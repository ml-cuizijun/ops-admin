<!--
  ============================================================================
  monitor.vue - 服务器监控页面
  ============================================================================
  
  这是一个待开发的页面，展示服务器实时监控数据
  
  可以扩展的功能：
  - CPU/内存使用率图表（使用 ECharts）
  - 实时日志查看
  - 服务状态监控
  - 告警信息展示
-->

<template>
  <div class="page-container">
    <!-- 
      el-card: 卡片容器
      shadow="hover": 鼠标悬停显示阴影
    -->
    <el-card shadow="hover">
      <!-- 卡片标题 -->
      <template #header>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span>服务器监控</span>
          <el-button type="primary" @click="doSomething">
            <el-icon color="red" size="24"><Position /></el-icon>
            点击跳转至首页
          </el-button>
        </div>
      </template>
      
      <!-- 
        el-empty: 空状态组件
        当没有数据或功能未开发时显示
        description: 描述文字
      -->
      <el-empty description="服务器监控 - 待开发" />
    </el-card>
  </div>
</template>

<script setup>
// 导入路由
import { useRouter } from 'vue-router'

// 获取路由实例
const router = useRouter()

// 点击跳转到仪表盘
function doSomething() {
  router.push('/dashboard')
}
/**
 * 这个页面暂时没有逻辑
 * 
 * 后续可以添加：
 * - 定时获取服务器状态
 * - 使用 ECharts 绑制图表
 * - WebSocket 实时推送数据
 */
</script>

<style scoped>
.page-container {
  padding: 10px;
}
</style>
