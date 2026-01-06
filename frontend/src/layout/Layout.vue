<!--
  ============================================================================
  Layout.vue - 整体布局组件
  ============================================================================
  
  这是整个后台管理系统的布局框架，包含：
  1. 左侧侧边栏（菜单导航）
  2. 右侧主区域（头部 + 内容区）
  
  布局结构示意图：
  ┌─────────────────────────────────────────────────────┐
  │                    el-container                      │
  │  ┌──────────┬──────────────────────────────────────┐ │
  │  │          │         el-header (头部)             │ │
  │  │ el-aside │  ┌────────────────────────────────┐  │ │
  │  │ (侧边栏) │  │      折叠按钮 + 面包屑         │  │ │
  │  │          │  └────────────────────────────────┘  │ │
  │  │ ┌──────┐ │  ┌────────────────────────────────┐  │ │
  │  │ │ Logo │ │  │        el-main (内容区)        │  │ │
  │  │ ├──────┤ │  │                                │  │ │
  │  │ │ 菜单 │ │  │    <router-view> 显示页面     │  │ │
  │  │ │      │ │  │    如: list.vue, monitor.vue  │  │ │
  │  │ └──────┘ │  └────────────────────────────────┘  │ │
  │  └──────────┴──────────────────────────────────────┘ │
  └─────────────────────────────────────────────────────┘
-->

<template>
  <!-- 
    el-container: Element Plus 的容器组件
    用于布局，会自动处理子组件的排列方式
    当子元素包含 el-aside 时，会水平排列
  -->
  <el-container class="layout-container">
    
    <!-- 
      ==================== 左侧：侧边栏 ====================
      el-aside: 侧边栏容器
      :width 动态绑定宽度，折叠时64px，展开时220px
    -->
    <el-aside :width="appStore.sidebarWidth" class="sidebar">
      
      <!-- 
        Logo 区域
        v-show: 条件显示（与 v-if 不同，v-show 只是 display:none）
        当侧边栏折叠时，隐藏文字只显示图标
      -->
      <div class="logo">
        <!-- el-icon: 图标组件，size 设置大小 -->
        <el-icon size="24"><Monitor /></el-icon>
        <!-- v-show="!appStore.isCollapse": 未折叠时显示文字 -->
        <span v-show="!appStore.isCollapse" class="logo-text">运维管理系统</span>
      </div>
      
      <!-- 
        ========== 菜单组件 ==========
        el-menu: Element Plus 的菜单组件
        
        属性说明：
        - :default-active="activeMenu"  当前激活的菜单项（高亮显示）
        - :collapse="appStore.isCollapse"  是否折叠菜单
        - :unique-opened="true"  是否只保持一个子菜单展开
        - router  开启路由模式，点击菜单项会自动调用 router.push()
        - background-color  菜单背景色
        - text-color  菜单文字颜色
        - active-text-color  激活项的文字颜色
      -->
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.isCollapse"
        :unique-opened="true"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        @select="handleMenuSelect"
      >
        <!-- 
          v-for 循环遍历路由配置，动态生成菜单
          menuRoutes 是从 router 配置中提取的路由数组
          :key 是 Vue 循环必须的唯一标识
        -->
        <template v-for="route in menuRoutes" :key="route.path">
          
          <!-- 
            ===== 情况1：只有一个子菜单 =====
            比如「仪表盘」，不需要展开，直接显示为菜单项
            
            v-if 条件判断：如果 children 数组长度为 1
            el-menu-item: 单个菜单项
            :index 是菜单的唯一标识，也是点击后跳转的路径
          -->
          <el-menu-item 
            v-if="route.children && route.children.length === 1"
            :index="getMenuIndex(route.path, route.children[0].path)"
          >
            <!-- 
              动态组件：根据路由 meta 中配置的 icon 名称显示对应图标
              :is 属性可以动态指定要渲染的组件
              route.children[0].meta.icon 的值如 'Odometer' 会渲染 <Odometer /> 图标
            -->
            <el-icon><component :is="route.children[0].meta.icon" /></el-icon>
            <!-- 
              #title 是具名插槽，菜单项的标题
              route.children[0].meta.title 如 '仪表盘'
            -->
            <template #title>{{ route.children[0].meta.title }}</template>
          </el-menu-item>
          
          <!-- 
            ===== 情况2：有多个子菜单 =====
            比如「服务器管理」下有「服务器列表」和「服务器监控」
            需要用 el-sub-menu（可展开的子菜单）
            
            v-else: 与上面的 v-if 对应
          -->
          <el-sub-menu v-else :index="route.path">
            <!-- 
              #title 插槽：子菜单的标题（显示在可点击展开的那一行）
              route.meta?.icon: 可选链操作符，如果 meta 不存在不会报错
            -->
            <template #title>
              <el-icon><component :is="route.meta?.icon" /></el-icon>
              <span>{{ route.meta?.title }}</span>
            </template>
            
            <!-- 
              再次 v-for 循环子路由，生成子菜单项
              child 是每个子路由对象
            -->
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
    
    <!-- 
      ==================== 右侧：主内容区 ====================
      这是一个嵌套的 el-container，包含头部和内容区
      flex-direction: column 让子元素垂直排列
    -->
    <el-container class="main-container">
      
      <!-- 
        ========== 头部 ==========
        el-header: 头部容器，默认高度 60px
      -->
      <el-header class="header">
        
        <!-- 头部左侧：折叠按钮 + 面包屑导航 -->
        <div class="header-left">
          
          <!-- 
            折叠/展开按钮
            @click: 点击事件，调用 store 中的 toggleSidebar 方法
            根据 isCollapse 状态显示不同图标：
            - Fold: 折叠图标（当前是展开状态，点击会折叠）
            - Expand: 展开图标（当前是折叠状态，点击会展开）
          -->
          <el-icon 
            class="collapse-btn" 
            @click="appStore.toggleSidebar"
          >
            <Fold v-if="!appStore.isCollapse" />
            <Expand v-else />
          </el-icon>
          
          <!-- 
            面包屑导航
            显示当前页面的路径层级，如：首页 / 服务器管理 / 服务器列表
            separator: 分隔符
          -->
          <el-breadcrumb separator="/">
            <!-- 固定的「首页」，点击跳转到 / -->
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <!-- 
              动态面包屑：根据当前路由的 matched 数组生成
              route.matched 包含当前路由匹配到的所有层级
            -->
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.meta?.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <!-- 头部右侧：用户信息下拉菜单 -->
        <div class="header-right">
          <!-- 
            el-dropdown: 下拉菜单组件
            鼠标悬停或点击会显示下拉选项
          -->
          <el-dropdown>
            <!-- 
              触发下拉的元素（用户头像区域）
              这里没有用插槽名，是默认插槽
            -->
            <span class="user-dropdown">
              <!-- el-avatar: 头像组件 -->
              <el-icon size="24px"><Avatar /></el-icon>
              <span class="username" >admin</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            
            <!-- 
              #dropdown 插槽：下拉菜单的内容
              ArrowDown
              el-dropdown-menu: 下拉菜单容器
              el-dropdown-item: 下拉菜单项
              <el-icon><Avatar /></el-icon>
              divided: 显示分割线
            -->
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
      
      <!-- 
        ========== 内容区 ==========
        el-main: 主要内容区域，会自动填充剩余空间
        这里放置 router-view，显示具体的页面组件
      -->
      <el-main class="main">
        <!-- 
          router-view: Vue Router 的核心组件
          根据当前 URL 路径，显示对应的组件
          
          v-slot="{ Component }": 获取要渲染的组件
          这是 Vue 3 的写法，用于配合 transition 实现动画
          
          transition: Vue 的过渡动画组件
          name="fade": 动画名称，对应下面 CSS 中的 .fade-xxx 类
          mode="out-in": 先执行离开动画，再执行进入动画
          
          <component :is="Component" />: 动态组件
          Component 就是路由匹配到的页面组件（如 list.vue）
        -->
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.path" />
        </router-view>
      </el-main>
      
    </el-container>



  </el-container>
</template>

<!-- 
  ============================================================================
  JavaScript 逻辑部分
  ============================================================================
  
  <script setup> 是 Vue 3 的语法糖，相当于：
  - 自动 export default { setup() { ... } }
  - 顶层变量自动暴露给模板使用
  - 不需要 return
-->
<script setup>
// ==================== 导入依赖 ====================

// computed: Vue 的计算属性，当依赖的数据变化时自动重新计算
import { computed } from 'vue'

// useRoute: 获取当前路由信息（路径、参数、query等）
// useRouter: 获取路由实例（可以进行跳转等操作）
import { useRoute, useRouter } from 'vue-router'

// 导入自定义的 Pinia store（状态管理）
// 用于管理侧边栏折叠状态
import { useAppStore } from '@/stores/app'

// ==================== 初始化 ====================

// 获取当前路由信息
// route.path: 当前路径，如 '/server/list'
// route.matched: 匹配到的路由数组
const route = useRoute()

// 获取路由实例
// router.options.routes: 所有路由配置
// router.push(): 跳转到指定路由
const router = useRouter()

// 获取 app store 实例
// appStore.isCollapse: 侧边栏是否折叠
// appStore.sidebarWidth: 侧边栏宽度
// appStore.toggleSidebar(): 切换折叠状态
const appStore = useAppStore()

// ==================== 计算属性 ====================

/**
 * 获取菜单路由
 * 从所有路由配置中筛选出需要显示在菜单中的路由
 * 过滤掉 /login 等不需要显示的路由
 * 
 * computed 的特点：
 * 1. 有缓存，依赖不变时不会重新计算
 * 2. 依赖变化时自动重新计算
 */
const menuRoutes = computed(() => {
  // router.options.routes 获取路由配置数组
  // filter 过滤，保留 path 不是 '/login' 的路由
  return router.options.routes.filter(r => r.path !== '/login')
})

/**
 * 当前激活的菜单
 * 用于设置 el-menu 的 default-active
 * 让当前页面对应的菜单项高亮显示
 */
const activeMenu = computed(() => {
  // route.path 就是当前 URL 路径，如 '/server/list'
  return route.path
})

/**
 * 面包屑导航数据
 * route.matched 是当前路由匹配到的所有层级数组
 * 
 * 例如访问 /server/list 时，matched 包含：
 * [
 *   { path: '/server', meta: { title: '服务器管理' } },
 *   { path: '/server/list', meta: { title: '服务器列表' } }
 * ]
 */
const breadcrumbs = computed(() => {
  // 过滤出有 meta.title 的路由项
  return route.matched.filter(item => item.meta && item.meta.title)
})

// ==================== 方法 ====================

/**
 * 获取菜单索引（路径）
 * 用于拼接完整的路由路径，避免双斜杠问题
 * 
 * @param parentPath 父路由路径，如 '/' 或 '/server'
 * @param childPath 子路由路径，如 'dashboard' 或 'list'
 * @returns 完整路径，如 '/dashboard' 或 '/server/list'
 * 
 * 为什么需要这个函数？
 * 因为路由配置中，子路由的 path 不带 /
 * 如果父路径是 '/'，直接拼接会变成 '//dashboard'
 */
const getMenuIndex = (parentPath, childPath) => {
  if (parentPath === '/') {
    // 父路径是根路径，直接加子路径
    return '/' + childPath  // 结果: '/dashboard'
  }
  // 父路径不是根，用 / 连接
  return parentPath + '/' + childPath  // 结果: '/server/list'
}

// 调试：菜单点击事件
const handleMenuSelect = (index) => {
  console.log('菜单点击:', index)
}
</script>

<!-- 
  ============================================================================
  样式部分
  ============================================================================
  
  scoped: 样式只作用于当前组件，不会影响其他组件
  Vue 会给每个元素加上 data-v-xxxx 属性来实现隔离
-->
<style scoped>
/* ==================== 整体布局 ==================== */

/* 布局容器，占满整个视口 */
.layout-container {
  width: 100%;
  height: 100%;
}

/* ==================== 侧边栏样式 ==================== */

/* 侧边栏容器 */
.sidebar {
  background-color: #304156;  /* 深蓝灰色背景 */
  transition: width 0.3s;      /* 宽度变化时的过渡动画（折叠/展开） */
  overflow: hidden;            /* 隐藏溢出内容 */
}

/* Logo 区域 */
.logo {
  height: 60px;                    /* 固定高度 */
  display: flex;                   /* Flex 布局 */
  align-items: center;             /* 垂直居中 */
  justify-content: center;         /* 水平居中 */
  color: #fff;                     /* 白色文字 */
  background-color: #263445;       /* 比侧边栏稍深的背景色 */
}

/* Logo 文字 */
.logo-text {
  margin-left: 10px;       /* 与图标的间距 */
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;     /* 不换行，防止折叠时文字换行 */
}

/* 去掉菜单默认的右边框 */
.el-menu {
  border-right: none;
}

/* ==================== 主内容区样式 ==================== */

/* 主容器，设置为垂直排列（头部在上，内容在下） */
.main-container {
  flex-direction: column;
}

/* 头部 */
.header {
  background-color: #fff;                        /* 白色背景 */
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);  /* 底部阴影 */
  display: flex;                                 /* Flex 布局 */
  align-items: center;                           /* 垂直居中 */
  justify-content: space-between;                /* 两端对齐 */
  padding: 0 20px;                               /* 左右内边距 */
}

/* 头部左侧区域 */
.header-left {
  display: flex;
  align-items: center;
}

/* 折叠按钮 */
.collapse-btn {
  font-size: 20px;
  cursor: pointer;       /* 鼠标变成手型 */
  margin-right: 20px;    /* 与面包屑的间距 */
}

/* 折叠按钮悬停效果 */
.collapse-btn:hover {
  color: #409EFF;        /* Element Plus 主题蓝色 */
}

/* 头部右侧区域 */
.header-right {
  display: flex;
  align-items: center;
}

/* 用户下拉触发区域 */
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* 用户名 */
.username {
  margin: 0 8px;         /* 左右间距 */
}

/* 主内容区 */
.main {
  background-color: #f0f2f5;  /* 浅灰色背景 */
  padding: 20px;               /* 内边距 */
}

/* ==================== 路由切换动画 ==================== */

/* 
  transition 组件会自动添加以下 CSS 类：
  - fade-enter-from: 进入动画的起始状态
  - fade-enter-active: 进入动画进行中
  - fade-enter-to: 进入动画的结束状态
  - fade-leave-from: 离开动画的起始状态
  - fade-leave-active: 离开动画进行中
  - fade-leave-to: 离开动画的结束状态
*/

/* 进入和离开动画的过程 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;  /* 透明度变化，0.3秒，缓动效果 */
}

/* 进入前 和 离开后 的状态：完全透明 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
