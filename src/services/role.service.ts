import { apiClient, type ApiResponse, type PaginatedResponse } from '@/lib/api'

export interface SysRole {
  roleId: number
  roleName: string
  roleKey: string
  roleSort: number
  dataScope?: string
  status?: string
  delFlag?: string
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
  remark?: string
  menuIds?: number[]
  deptIds?: number[]
}

export interface RoleListQuery {
  roleName?: string
  roleKey?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface CreateRoleRequest {
  roleName: string
  roleKey: string
  roleSort: number
  dataScope?: string
  menuIds?: number[]
  deptIds?: number[]
  status?: string
  remark?: string
}

export interface UpdateRoleRequest {
  roleName?: string
  roleKey?: string
  roleSort?: number
  dataScope?: string
  menuIds?: number[]
  deptIds?: number[]
  status?: string
  remark?: string
}

export const roleService = {
  async getRoleList(query: RoleListQuery): Promise<PaginatedResponse<SysRole>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<SysRole>>>(
      '/api/system/role/list',
      { params: query }
    )
    return response.data.data
  },

  async getAllRoles(): Promise<SysRole[]> {
    const response = await apiClient.get<ApiResponse<SysRole[]>>('/api/system/role/all')
    return response.data.data
  },

  async getRoleById(id: number): Promise<SysRole> {
    const response = await apiClient.get<ApiResponse<SysRole>>(`/api/system/role/${id}`)
    return response.data.data
  },

  async createRole(data: CreateRoleRequest): Promise<{ roleId: number }> {
    const response = await apiClient.post<ApiResponse<{ roleId: number }>>(
      '/api/system/role',
      data
    )
    return response.data.data
  },

  async updateRole(id: number, data: UpdateRoleRequest): Promise<void> {
    await apiClient.put<ApiResponse>(`/api/system/role/${id}`, data)
  },

  async deleteRole(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/api/system/role/${id}`)
  },

  async deleteRoles(roleIds: number[]): Promise<void> {
    await apiClient.delete<ApiResponse>('/api/system/role/batch', { data: { roleIds } })
  },

  async assignMenusToRole(id: number, menuIds: number[]): Promise<void> {
    await apiClient.put<ApiResponse>(`/api/system/role/${id}/menus`, { menuIds })
  },

  async assignDeptsToRole(id: number, deptIds: number[]): Promise<void> {
    await apiClient.put<ApiResponse>(`/api/system/role/${id}/depts`, { deptIds })
  },
}
