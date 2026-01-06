<!--
  ============================================================================
  dashboard/index.vue - 仪表盘页面
  ============================================================================
  
  这是系统的首页/仪表盘，通常展示：
  - 系统概览统计（服务器数量、告警数等）
  - 快捷操作入口
  - 最近活动
  - 系统状态图表
  
  目前是占位页面，待开发
-->

<template>
  <div class="dashboard-container">
    <!-- 
      el-empty: 空状态占位组件
      后续可以替换为实际的仪表盘内容
    -->
    <el-empty description="仪表盘开发中..." />
  </div>
</template>

<script setup>
/**
 * 仪表盘页面 - 待开发
 * 
 * 后续可以添加：
 * - 统计卡片（el-statistic）
 * - 图表（ECharts）
 * - 快捷入口
 */
</script>

<style scoped>
/* 仪表盘容器样式 */
.dashboard-container {
  padding: 20px;
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  min-height: 400px;        /* 最小高度 */
}
</style>
