<template>
  <div class="page-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Redis 管理</span>
          <el-button type="primary" icon="Plus">添加实例</el-button>
        </div>
      </template>
      <el-empty description="Redis 管理 - 待开发" />
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
