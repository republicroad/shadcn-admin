import axios from 'axios'

// process.env 是 Node.js 的环境变量接口 import.meta.env 是 Vite（ESM）在构建期注入的前端环境变量
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL:import.meta.env.BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
})

// Request interceptor - add auth token
authApi.interceptors.request.use((config) => {
  // Access the URL being called
  const requestUrl = config.url
  console.log('Request URL:', requestUrl)
  return config
})

// Response interceptor - handle errors globally
authApi.interceptors.response.use(
  (response) => {
    // Access the URL from the response config
    const originalUrl = response.config.url
    console.log('authapi response.config.url:', originalUrl)
    console.log('authapi Response:', response)
    return response
  },
  (error) => {
    if (error.config) {
      console.log('Request failed for URL:', error.config.url)
    }
    return Promise.reject(error)
  }
)

export default authApi
