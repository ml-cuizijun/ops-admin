import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏折叠状态
  const isCollapse = ref(false)
  
  // 切换侧边栏
  const toggleSidebar = () => {
    isCollapse.value = !isCollapse.value
  }
  
  // 侧边栏宽度
  const sidebarWidth = computed(() => {
    return isCollapse.value ? '64px' : '220px'
  })
  
  return {
    isCollapse,
    toggleSidebar,
    sidebarWidth
  }
})
