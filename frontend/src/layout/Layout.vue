<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="appStore.sidebarWidth" class="sidebar">
      <div class="logo">
        <el-icon size="24"><Monitor /></el-icon>
        <span v-show="!appStore.isCollapse" class="logo-text">运维管理系统</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.isCollapse"
        :unique-opened="true"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <!-- 只有一个子菜单 -->
          <el-menu-item 
            v-if="route.children && route.children.length === 1"
            :index="getMenuIndex(route.path, route.children[0].path)"
          >
            <el-icon><component :is="route.children[0].meta.icon" /></el-icon>
            <template #title>{{ route.children[0].meta.title }}</template>
          </el-menu-item>
          
          <!-- 多个子菜单 -->
          <el-sub-menu v-else :index="route.path">
            <template #title>
              <el-icon><component :is="route.meta?.icon" /></el-icon>
              <span>{{ route.meta?.title }}</span>
            </template>
            <el-menu-item
              v-for="child in route.children"
              :key="child.path"
              :index="getMenuIndex(route.path, child.path)"
            >
              <el-icon><component :is="child.meta.icon" /></el-icon>
              <template #title>{{ child.meta.title }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon 
            class="collapse-btn" 
            @click="appStore.toggleSidebar"
          >
            <Fold v-if="!appStore.isCollapse" />
            <Expand v-else />
          </el-icon>
          
          <!-- 面包屑 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.meta?.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown>
            <span class="user-dropdown">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">Admin</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="User">个人中心</el-dropdown-item>
                <el-dropdown-item icon="Setting">系统设置</el-dropdown-item>
                <el-dropdown-item divided icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 内容区 -->
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 获取菜单路由
const menuRoutes = computed(() => {
  return router.options.routes.filter(r => r.path !== '/login')
})

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 面包屑
const breadcrumbs = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title)
})

// 获取菜单索引，避免双斜杠问题
const getMenuIndex = (parentPath, childPath) => {
  if (parentPath === '/') {
    return '/' + childPath
  }
  return parentPath + '/' + childPath
}
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100%;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #263445;
}

.logo-text {
  margin-left: 10px;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
}

.el-menu {
  border-right: none;
}

.main-container {
  flex-direction: column;
}

.header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
}

.collapse-btn:hover {
  color: #409EFF;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 8px;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
