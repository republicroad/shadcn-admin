import { apiClient, type ApiResponse } from '@/lib/api'

export interface SysDept {
  deptId: number
  parentId?: number
  ancestors?: string
  deptName: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string
  delFlag?: string
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
  children?: SysDept[]
}

export interface DeptQuery {
  deptName?: string
  status?: string
}

export interface CreateDeptRequest {
  deptName: string
  parentId?: number
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string
}

export interface UpdateDeptRequest {
  deptName?: string
  parentId?: number
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string
}

export const deptService = {
  async getDeptTree(query?: DeptQuery): Promise<SysDept[]> {
    const response = await apiClient.get<ApiResponse<SysDept[]>>('/api/system/dept/tree', {
      params: query,
    })
    return response.data.data
  },

  async getAllDepts(query?: DeptQuery): Promise<SysDept[]> {
    const response = await apiClient.get<ApiResponse<SysDept[]>>('/api/system/dept/list', {
      params: query,
    })
    return response.data.data
  },

  async getDeptById(id: number): Promise<SysDept> {
    const response = await apiClient.get<ApiResponse<SysDept>>(`/api/system/dept/${id}`)
    return response.data.data
  },

  async getDeptsByRoleId(roleId: number): Promise<SysDept[]> {
    const response = await apiClient.get<ApiResponse<SysDept[]>>(
      `/api/system/dept/role/${roleId}`
    )
    return response.data.data
  },

  async createDept(data: CreateDeptRequest): Promise<{ deptId: number }> {
    const response = await apiClient.post<ApiResponse<{ deptId: number }>>(
      '/api/system/dept',
      data
    )
    return response.data.data
  },

  async updateDept(id: number, data: UpdateDeptRequest): Promise<void> {
    await apiClient.put<ApiResponse>(`/api/system/dept/${id}`, data)
  },

  async deleteDept(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/api/system/dept/${id}`)
  },
}
