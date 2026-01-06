/**
 * ============================================================================
 * main.js - Vue 应用入口文件
 * ============================================================================
 * 
 * 这是整个 Vue 应用的起点，相当于应用的「总开关」
 * 负责：
 * 1. 创建 Vue 应用实例
 * 2. 安装各种插件（Router、Pinia、Element Plus 等）
 * 3. 挂载应用到 HTML 页面
 * 
 * 执行顺序：
 * index.html → main.js → App.vue → Layout.vue → 具体页面组件
 */

// ==================== 导入依赖 ====================

// createApp: Vue 3 的核心函数，用于创建应用实例
import { createApp } from 'vue'

// createPinia: 创建 Pinia 状态管理实例
// Pinia 是 Vue 3 官方推荐的状态管理库（替代 Vuex）
import { createPinia } from 'pinia'

// 导入根组件
// App.vue 是整个应用的根组件，所有其他组件都是它的后代
import App from './App.vue'

// 导入路由
// router 负责 URL 与组件的映射
import router from './router'

// 导入 Element Plus UI 组件库
// Element Plus 是 Vue 3 最流行的 UI 组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'  // 必须导入样式文件

// 导入 Element Plus 的所有图标
// 图标需要单独导入和注册
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入全局样式
import './assets/main.css'

// ==================== 创建应用 ====================

/**
 * createApp(App): 创建 Vue 应用实例
 * App 是根组件，整个应用从这里开始渲染
 */
const app = createApp(App)

// ==================== 安装插件 ====================

/**
 * app.use(): 安装 Vue 插件
 * 
 * 插件安装顺序一般没有严格要求
 * 但建议：先安装核心插件（Pinia、Router），再安装 UI 库
 */

// 安装 Pinia 状态管理
// 安装后可以在任何组件中使用 store
app.use(createPinia())

// 安装 Vue Router
// 安装后可以使用 <router-view>、<router-link> 等组件
// 以及 useRoute()、useRouter() 等 API
app.use(router)

// 安装 Element Plus
// 安装后可以使用 <el-button>、<el-table> 等组件
app.use(ElementPlus)

// ==================== 注册图标 ====================

/**
 * 全局注册 Element Plus 图标
 * 
 * 为什么需要单独注册图标？
 * - Element Plus 图标是单独的包（@element-plus/icons-vue）
 * - 图标本质上也是 Vue 组件
 * - 需要注册后才能在模板中使用 <Odometer />、<Monitor /> 等
 * 
 * 遍历所有图标组件，逐个注册
 * Object.entries: 将对象转为 [key, value] 数组
 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  // app.component(名称, 组件): 全局注册组件
  // 注册后可以在任何模板中直接使用 <Monitor />
  app.component(key, component)
}

// ==================== 挂载应用 ====================

/**
 * app.mount('#app'): 将 Vue 应用挂载到 DOM
 * 
 * '#app' 是 CSS 选择器，对应 index.html 中的：
 * <div id="app"></div>
 * 
 * 挂载后，Vue 会：
 * 1. 找到 id="app" 的元素
 * 2. 用 App.vue 的内容替换该元素
 * 3. 开始响应式渲染
 */
app.mount('#app')

/**
 * 启动流程总结：
 * 
 * 1. 浏览器请求 http://localhost:3000/
 * 2. Vite 返回 index.html
 * 3. index.html 加载 main.js
 * 4. main.js 执行：
 *    - 创建 Vue 应用
 *    - 安装插件（Pinia、Router、Element Plus）
 *    - 注册图标
 *    - 挂载到 #app
 * 5. Vue 渲染 App.vue
 * 6. App.vue 中的 <router-view> 根据 URL 显示对应组件
 * 7. 如果 URL 是 /server/list：
 *    - 显示 Layout.vue
 *    - Layout.vue 中的 <router-view> 显示 server/list.vue
 */
