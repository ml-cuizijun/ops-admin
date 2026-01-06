/**
 * ============================================================================
 * request.js - Axios 请求封装
 * ============================================================================
 *
 * 什么是 Axios？
 * - Axios 是最流行的 HTTP 请求库
 * - 可以在浏览器和 Node.js 中使用
 * - 支持 Promise，可以用 async/await
 *
 * 为什么要封装 Axios？
 * 1. 统一配置：baseURL、超时时间等只需配置一次
 * 2. 统一处理：请求前添加 token、响应后处理错误
 * 3. 代码复用：其他文件直接 import 使用
 *
 * 请求流程：
 * 组件调用 API → request.js 发送请求 → 后端 → 响应 → 拦截器处理 → 返回组件
 */

// ==================== 导入依赖 ====================

// axios: HTTP 请求库
import axios from 'axios'

// ElMessage: Element Plus 的消息提示组件
// 用于显示错误提示
import { ElMessage } from 'element-plus'

// ==================== 创建 Axios 实例 ====================

/**
 * axios.create(): 创建一个 axios 实例
 *
 * 为什么不直接用 axios？
 * - 可以为不同的 API 创建不同的实例
 * - 每个实例可以有独立的配置
 * - 比如：一个用于业务 API，一个用于上传文件
 *
 * 配置选项：
 * - baseURL: 请求的基础 URL，所有请求都会加上这个前缀
 *   比如请求 '/servers' 实际会请求 'http://localhost:8080/api/servers'
 * - timeout: 请求超时时间（毫秒）
 *   超过这个时间还没响应，就会报错
 */
const request = axios.create({
  // 后端 API 地址
  // 开发时是 localhost，生产环境需要改成实际域名
  baseURL: 'http://localhost:8080/api',

  // 超时时间：10 秒
  // 如果 10 秒内没有响应，请求会失败
  timeout: 10000
})

// ==================== 请求拦截器（可选）====================

/**
 * 请求拦截器：在请求发出之前执行
 *
 * 常用场景：
 * - 添加 token 到请求头（登录认证）
 * - 添加 loading 状态
 * - 请求参数处理
 *
 * 示例代码（取消注释即可使用）：
 */
// request.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = \`Bearer \${token}\`
//     }
//     return config
//   },
//   error => Promise.reject(error)
// )

// ==================== 响应拦截器 ====================

/**
 * 响应拦截器：在收到响应之后、返回给调用者之前执行
 *
 * 作用：
 * 1. 统一处理响应数据格式
 * 2. 统一处理错误（如 token 过期、服务器错误）
 * 3. 简化组件中的代码
 */
request.interceptors.response.use(
  /**
   * 成功回调：HTTP 状态码 2xx 时执行
   * @param response - Axios 响应对象
   */
  response => {
    // response.data 是后端返回的数据
    // 格式：{ code: 0, msg: 'success', data: ... }
    const res = response.data

    /**
     * 判断业务状态码
     * code === 0 表示成功
     * code !== 0 表示业务错误
     */
    if (res.code !== 0) {
      // 显示错误提示
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg))
    }

    // 成功时返回完整响应
    return res
  },

  /**
   * 失败回调：网络错误或 HTTP 状态码非 2xx 时执行
   */
  error => {
    ElMessage.error('网络错误')
    return Promise.reject(error)
  }
)

// ==================== 导出 ====================

/**
 * 导出 axios 实例
 * 使用：request.get('/xxx'), request.post('/xxx', data)
 */
export default request
