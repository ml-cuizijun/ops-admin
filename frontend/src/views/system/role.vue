<template>
  <div class="page-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" icon="Plus">添加角色</el-button>
        </div>
      </template>
      <el-empty description="角色管理 - 待开发" />
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
