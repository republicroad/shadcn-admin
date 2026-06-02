import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { getCookie } from './cookies'
import { getPersistedRulesAuth, normalizeRulesToken } from './auth'

const ACCESS_TOKEN = 'brdeUser'
const rulesApiBaseUrl = import.meta.env.VITE_API_URL || '/'
const UNAUTHORIZED_MESSAGE = '规则服务鉴权失败，请重新登录后重试'
const MISSING_TOKEN_MESSAGE = '未获取到登录 token，规则服务请求已中止'

type RulesResponsePayload = {
  code?: number
  status?: number
  msg?: string
  message?: string
}

function getCookieToken() {
  const cookieState = getCookie(ACCESS_TOKEN)
  if (!cookieState) return ''

  try {
    return JSON.parse(cookieState)
  } catch {
    return ''
  }
}

function getRulesRequestToken() {
  return normalizeRulesToken(
    useAuthStore.getState().accessToken ||
      getPersistedRulesAuth().accessToken ||
      getCookieToken()
  )
}

function getBusinessError(payload?: RulesResponsePayload) {
  if (!payload) return null

  const isCodeError =
    typeof payload.code === 'number' && payload.code !== 0 && payload.code !== 200
  const isStatusError =
    typeof payload.status === 'number' &&
    payload.status !== 0 &&
    payload.status !== 200

  if (!isCodeError && !isStatusError) return null

  return new Error(payload.msg || payload.message || '请求失败')
}

const apiClient: AxiosInstance = axios.create({
  baseURL: rulesApiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getRulesRequestToken()

    if (token) {
      config.headers.Authorization = token
      return config
    }

    return Promise.reject(new Error(MISSING_TOKEN_MESSAGE))
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => {
    const businessError = getBusinessError(response.data as RulesResponsePayload)
    if (businessError) {
      return Promise.reject(businessError)
    }

    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      return Promise.reject(new Error(UNAUTHORIZED_MESSAGE))
    }

    return Promise.reject(error)
  }
)

export default apiClient
