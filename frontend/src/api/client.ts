import axios from 'axios'
import router from '@/router'

/** Axios 实例 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器: 自动添加 Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器: 统一错误处理
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期, 清除登录状态并跳转
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('email')
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  },
)

export { apiClient }
