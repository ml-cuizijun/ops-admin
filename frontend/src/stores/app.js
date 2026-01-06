/**
 * ============================================================================
 * app.js - 应用全局状态管理（Pinia Store）
 * ============================================================================
 * 
 * 什么是状态管理？
 * - 状态（State）就是数据，比如：侧边栏是否折叠、用户信息、主题颜色等
 * - 状态管理就是统一管理这些数据，让多个组件可以共享
 * 
 * 为什么需要状态管理？
 * - 如果状态只在一个组件内使用，用组件内的 ref/reactive 就够了
 * - 如果状态需要在多个组件之间共享，就需要状态管理
 * 
 * 例如：侧边栏折叠状态
 * - Layout.vue 需要读取这个状态来决定侧边栏宽度
 * - Header 组件需要修改这个状态（点击折叠按钮）
 * - 两个组件需要共享同一个状态，所以放到 store 里
 * 
 * Pinia vs Vuex：
 * - Pinia 是 Vue 3 官方推荐的状态管理库
 * - 比 Vuex 更简单，没有 mutations，直接修改 state
 * - 支持 TypeScript，支持 Vue DevTools
 */

// ==================== 导入依赖 ====================

// defineStore: Pinia 的核心函数，用于定义一个 store
import { defineStore } from 'pinia'

// ref: Vue 3 的响应式数据
// computed: 计算属性
import { ref, computed } from 'vue'

// ==================== 定义 Store ====================

/**
 * defineStore 的两种写法：
 * 
 * 1. Options API 风格（类似 Vue 2）
 * defineStore('app', {
 *   state: () => ({ isCollapse: false }),
 *   getters: { ... },
 *   actions: { ... }
 * })
 * 
 * 2. Composition API 风格（推荐，我们用的这种）
 * defineStore('app', () => {
 *   const xxx = ref()
 *   const yyy = computed()
 *   function zzz() {}
 *   return { xxx, yyy, zzz }
 * })
 */

/**
 * 导出 useAppStore
 * 
 * 命名规范：use + Store名 + Store
 * 如：useAppStore, useUserStore, useSettingsStore
 * 
 * 第一个参数 'app' 是 store 的唯一 ID
 * 第二个参数是一个 setup 函数，返回要暴露的状态和方法
 */
export const useAppStore = defineStore('app', () => {
  
  // ==================== State（状态）====================
  
  /**
   * 侧边栏是否折叠
   * ref() 创建响应式数据
   * 
   * 响应式的意思：当这个值改变时，使用它的组件会自动更新
   * 比如：isCollapse 从 false 变成 true 时，Layout.vue 会自动重新渲染
   */
  const isCollapse = ref(false)
  
  // ==================== Getters（计算属性）====================
  
  /**
   * 侧边栏宽度
   * 使用 computed 创建计算属性
   * 
   * computed 的特点：
   * - 依赖 isCollapse，当 isCollapse 变化时自动重新计算
   * - 有缓存，如果 isCollapse 没变，多次访问不会重复计算
   * 
   * 在 Layout.vue 中这样使用：
   * <el-aside :width="appStore.sidebarWidth">
   */
  const sidebarWidth = computed(() => {
    // 三元表达式：条件 ? 真时的值 : 假时的值
    // 折叠时 64px（只显示图标），展开时 220px
    return isCollapse.value ? '64px' : '220px'
  })
  
  // ==================== Actions（方法）====================
  
  /**
   * 切换侧边栏折叠状态
   * 
   * 在 Pinia 中，可以直接定义普通函数作为 action
   * 不需要像 Vuex 那样区分 mutations 和 actions
   * 
   * 在 Layout.vue 中这样调用：
   * @click="appStore.toggleSidebar"
   */
  function toggleSidebar() {
    // 取反操作：true 变 false，false 变 true
    isCollapse.value = !isCollapse.value
  }
  
  // ==================== 返回暴露的内容 ====================
  
  /**
   * 必须 return 要暴露给组件使用的状态和方法
   * 没有 return 的变量，组件无法访问
   */
  return {
    // 状态
    isCollapse,       // 是否折叠
    
    // 计算属性
    sidebarWidth,     // 侧边栏宽度
    
    // 方法
    toggleSidebar     // 切换折叠
  }
})

/**
 * 使用示例（在组件中）：
 * 
 * <script setup>
 * import { useAppStore } from '@/stores/app'
 * 
 * // 获取 store 实例
 * const appStore = useAppStore()
 * 
 * // 读取状态
 * console.log(appStore.isCollapse)      // false
 * console.log(appStore.sidebarWidth)    // '220px'
 * 
 * // 调用方法
 * appStore.toggleSidebar()              // 切换折叠状态
 * 
 * // 直接修改状态（Pinia 允许，Vuex 不允许）
 * appStore.isCollapse = true
 * </script>
 * 
 * <template>
 *   <!-- 在模板中使用 -->
 *   <div :class="{ collapsed: appStore.isCollapse }">
 *     宽度: {{ appStore.sidebarWidth }}
 *   </div>
 *   <button @click="appStore.toggleSidebar">切换</button>
 * </template>
 */
