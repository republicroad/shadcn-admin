import axios from 'axios';
import { useAuthStore } from '@/stores/auth'



// process.env 是 Node.js 的环境变量接口 import.meta.env 是 Vite（ESM）在构建期注入的前端环境变量
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL:import.meta.env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  // Access the URL being called
  const requestUrl = config.url
  console.log('Request URL:', requestUrl)
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // // 现在将登录接口使用单独的 axios实例authApi来处理了, 这个请求拦截器就不需要排除登录接口了.
  // // 未来可以考虑给登录接口设置不同的 URL 前缀, 以便在请求拦截器中区分处理.  requestUrl?.startsWith('/api/auth/')
  // if (requestUrl && !requestUrl.includes('/api/login')) {
  //   // 给登录，注册，忘记密码登接口准备一个 auth 前缀或者白名单，以便在请求拦截器中排除这些接口的 token 注入逻辑.
  //   // const token = localStorage.getItem('auth_token')
  //   const token = useAuthStore.getState().accessToken
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token}`
  //   }
  // }
  return config
})

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    // Access the URL from the response config
    const originalUrl = response.config.url
    console.log('api response.config.url:', originalUrl)
    console.log('api Response:', response)
    return response
  },
  (error) => {
    if (error.config) {
      console.log('Request failed for URL:', error.config.url)
    }
    if (error.response?.status === 401) {
      // localStorage.removeItem('auth_token')
      // useAuthStore.getState().reset()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
