/**
 * ============================================================================
 * Vue Router 路由配置文件
 * ============================================================================
 * 
 * 路由（Router）是什么？
 * - 路由就是 URL 路径与页面组件的映射关系
 * - 当用户访问不同的 URL 时，显示不同的页面组件
 * 
 * 例如：
 * - 访问 /dashboard → 显示 Dashboard.vue 组件
 * - 访问 /server/list → 显示 server/list.vue 组件
 * 
 * 单页应用（SPA）的特点：
 * - 只有一个 HTML 文件（index.html）
 * - 页面切换不会刷新浏览器，只是替换组件
 * - 体验更流畅，像原生应用一样
 */

// ==================== 导入依赖 ====================

// createRouter: 创建路由实例的函数
// createWebHistory: 使用 HTML5 History 模式（URL 不带 #）
import { createRouter, createWebHistory } from 'vue-router'

// 导入布局组件
// Layout 是整个页面的骨架（侧边栏 + 头部 + 内容区）
import Layout from '@/layout/Layout.vue'

// ==================== 路由配置 ====================

/**
 * 路由配置数组
 * 每个对象代表一个路由规则
 * 
 * 路由配置的常用属性：
 * - path: URL 路径
 * - name: 路由名称（可选，用于编程式导航）
 * - component: 该路径对应的组件
 * - redirect: 重定向到其他路径
 * - children: 子路由（嵌套路由）
 * - meta: 路由元信息（自定义数据，如标题、图标、权限等）
 */
const routes = [
  // ========== 根路由 '/' ==========
  {
    // 访问根路径时
    path: '/',
    
    // 使用 Layout 作为容器组件
    // Layout 包含侧边栏和头部，中间有 <router-view> 显示子组件
    component: Layout,
    
    // 访问 '/' 时自动跳转到 '/dashboard'
    redirect: '/dashboard',
    
    /**
     * 子路由配置
     * 注意：子路由的 path 不需要加 /，会自动拼接父路径
     * 
     * 子路由的工作方式：
     * 1. 用户访问 /dashboard
     * 2. 先加载父组件 Layout
     * 3. Layout 中的 <router-view> 再加载子组件 Dashboard.vue
     */
    children: [
      {
        // 完整路径是 '/' + 'dashboard' = '/dashboard'
        path: 'dashboard',
        
        // 路由名称，可用于 router.push({ name: 'Dashboard' })
        name: 'Dashboard',
        
        /**
         * 懒加载组件
         * () => import(...) 语法表示懒加载
         * 
         * 懒加载的好处：
         * - 组件会被分割成单独的 JS 文件
         * - 只有访问该路由时才会加载
         * - 减少首屏加载时间
         * 
         * 如果不用懒加载，写法是：
         * import Dashboard from '@/views/dashboard/index.vue'
         * component: Dashboard
         */
        component: () => import('@/views/dashboard/index.vue'),
        
        /**
         * 路由元信息（meta）
         * 可以存放任何自定义数据，常用于：
         * - title: 页面标题（显示在菜单、面包屑）
         * - icon: 图标名称（显示在菜单）
         * - requiresAuth: 是否需要登录
         * - roles: 允许访问的角色
         */
        meta: { 
          title: '仪表盘',      // 菜单显示的文字
          icon: 'Odometer'     // Element Plus 图标名称
        }
      }
    ]
  },
  
  // ========== 服务器管理路由 '/server' ==========
  {
    path: '/server',
    component: Layout,     // 同样使用 Layout 作为容器
    
    // 访问 /server 时重定向到 /server/list
    redirect: '/server/list',
    
    // 父路由的 meta，用于菜单分组
    meta: { 
      title: '服务器管理',   // 菜单组的标题
      icon: 'Monitor'       // 菜单组的图标
    },
    
    // 子路由：服务器列表 和 服务器监控
    children: [
      {
        // 完整路径: /server/list
        path: 'list',
        name: 'ServerList',
        component: () => import('@/views/server/list.vue'),
        meta: { 
          title: '服务器列表', 
          icon: 'List' 
        }
      },
      {
        // 完整路径: /server/monitor
        path: 'monitor',
        name: 'ServerMonitor',
        component: () => import('@/views/server/monitor.vue'),
        meta: { 
          title: '服务器监控', 
          icon: 'DataLine' 
        }
      }
    ]
  }
  
  /**
   * 如果要添加更多路由，可以继续在这里添加
   * 例如：
   * 
   * {
   *   path: '/user',
   *   component: Layout,
   *   meta: { title: '用户管理', icon: 'User' },
   *   children: [
   *     {
   *       path: 'list',
   *       name: 'UserList',
   *       component: () => import('@/views/user/list.vue'),
   *       meta: { title: '用户列表', icon: 'List' }
   *     }
   *   ]
   * }
   */
]

// ==================== 创建路由实例 ====================

/**
 * createRouter: 创建路由实例
 * 
 * history: 路由模式
 * - createWebHistory(): HTML5 History 模式，URL 美观，如 /user/list
 * - createWebHashHistory(): Hash 模式，URL 带 #，如 /#/user/list
 * 
 * History 模式需要服务器配置支持，否则刷新会 404
 * Hash 模式不需要服务器配置，但 URL 不够美观
 * 
 * import.meta.env.BASE_URL: Vite 的环境变量，表示应用的基础路径
 * 默认是 '/'，可以在 vite.config.js 中配置 base 修改
 */
const router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHistory(import.meta.env.BASE_URL),
  
  // 路由配置
  routes
})

/**
 * 路由守卫（可选，后续可添加）
 * 
 * 全局前置守卫：在每次路由跳转前执行
 * 常用于：登录验证、权限检查、页面标题设置等
 * 
 * router.beforeEach((to, from, next) => {
 *   // to: 即将进入的路由
 *   // from: 当前离开的路由
 *   // next: 必须调用，决定是否放行
 *   
 *   // 示例：检查是否需要登录
 *   if (to.meta.requiresAuth && !isLoggedIn()) {
 *     next('/login')  // 跳转到登录页
 *   } else {
 *     next()  // 放行
 *   }
 * })
 */

// 导出路由实例，在 main.js 中使用
export default router
