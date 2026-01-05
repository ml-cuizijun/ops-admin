import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({
    id: 0,
    username: '',
    nickname: '',
    avatar: '',
    roles: []
  })
  
  // 设置 token
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }
  
  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
  }
  
  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = {
      id: 0,
      username: '',
      nickname: '',
      avatar: '',
      roles: []
    }
    localStorage.removeItem('token')
  }
  
  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout
  }
})
