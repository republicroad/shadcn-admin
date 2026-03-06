import { apiClient, type ApiResponse, type PaginatedResponse } from '@/lib/api'

export interface SysUser {
  userId: number
  userName: string
  nickName: string
  email: string
  phonenumber: string
  sex: string
  avatar: string
  password?: string
  status: string
  delFlag: string
  loginIp?: string
  loginDate?: string
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
  remark?: string
  deptId: number
  dept?: any
  roles?: any[]
  roleIds?: number[]
  postIds?: number[]
  posts?: any[]
}

export interface UserListQuery {
  userName?: string
  nickName?: string
  phonenumber?: string
  status?: string
  deptId?: number
  page?: number
  pageSize?: number
}

export interface CreateUserRequest {
  userName: string
  nickName: string
  email: string
  phonenumber: string
  sex?: string
  password: string
  status?: string
  deptId?: number
  postIds?: number[]
  roleIds?: number[]
  remark?: string
}

export interface UpdateUserRequest {
  nickName?: string
  email?: string
  phonenumber?: string
  sex?: string
  status?: string
  deptId?: number
  postIds?: number[]
  roleIds?: number[]
  remark?: string
}

export const userService = {
  async getUserList(query: UserListQuery): Promise<PaginatedResponse<SysUser>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<SysUser>>>(
      '/api/system/user/list',
      { params: query }
    )
    return response.data.data
  },

  async getUserById(id: number): Promise<SysUser> {
    const response = await apiClient.get<ApiResponse<SysUser>>(`/api/system/user/${id}`)
    return response.data.data
  },

  async createUser(data: CreateUserRequest): Promise<{ userId: number }> {
    const response = await apiClient.post<ApiResponse<{ userId: number }>>(
      '/api/system/user',
      data
    )
    return response.data.data
  },

  async updateUser(id: number, data: UpdateUserRequest): Promise<void> {
    await apiClient.put<ApiResponse>(`/api/system/user/${id}`, data)
  },

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/api/system/user/${id}`)
  },

  async deleteUsers(userIds: number[]): Promise<void> {
    await apiClient.delete<ApiResponse>('/api/system/user/batch', { data: { userIds } })
  },

  async updateUserStatus(id: number, status: string): Promise<void> {
    await apiClient.put<ApiResponse>(`/api/system/user/${id}/status`, { status })
  },

  async resetPassword(id: number, password: string): Promise<void> {
    await apiClient.put<ApiResponse>(`/api/system/user/${id}/resetPassword`, { password })
  },

  async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.put<ApiResponse>(`/api/system/user/${id}/changePassword`, {
      oldPassword,
      newPassword,
    })
  },
}
