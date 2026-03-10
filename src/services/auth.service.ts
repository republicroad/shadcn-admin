import { apiClient, type ApiResponse } from '@/lib/api'

export interface LoginRequest {
  userName: string
  password: string
}

export interface RegisterRequest {
  userName: string
  password: string
  email?: string
  nickName?: string
}

export interface LoginResponse {
  user: {
    userId: number
    userName: string
    nickName: string
    email: string
    phonenumber: string
    sex: string
    avatar: string
    status: string
    deptId: number
    postIds: number[]
    roleIds: number[]
  }
  token: string
}

export interface UserInfo {
  userId: number
  userName: string
  nickName: string
  email: string
  phonenumber: string
  sex: string
  avatar: string
  status: string
  deptId: number
  dept?: any
  roles?: any[]
  posts?: any[]
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', data)
    return response.data.data
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/register', data)
    return response.data.data
  },

  async refreshToken(): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/api/auth/refresh')
    return response.data.data.token
  },

  async getUserInfo(): Promise<UserInfo> {
    const response = await apiClient.get<ApiResponse<UserInfo>>('/api/auth/userinfo')
    return response.data.data
  },

  async getUserPermissions(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>('/api/auth/permissions')
    return response.data.data
  },

  async getUserRoles(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/auth/roles')
    return response.data.data
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.put<ApiResponse>('/api/auth/changePassword', data)
  },

  async checkPermission(permission: string): Promise<boolean> {
    const response = await apiClient.post<ApiResponse<{ hasPermission: boolean }>>(
      '/api/auth/checkPermission',
      { permission }
    )
    return response.data.data.hasPermission
  },

  async checkRole(roleKey: string): Promise<boolean> {
    const response = await apiClient.post<ApiResponse<{ hasRole: boolean }>>(
      '/api/auth/checkRole',
      { roleKey }
    )
    return response.data.data.hasRole
  },
}
