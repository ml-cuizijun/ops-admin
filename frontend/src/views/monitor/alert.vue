<template>
  <div class="page-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>告警管理</span>
          <el-button type="primary" icon="Plus">添加告警规则</el-button>
        </div>
      </template>
      <el-empty description="告警管理 - 待开发" />
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page-container {
  padding: 10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
