<template>
  <div class="page-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>服务器列表</span>
          <el-button type="primary" icon="Plus">添加服务器</el-button>
        </div>
      </template>
      <el-empty description="服务器列表 - 待开发" />
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
