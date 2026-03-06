import { apiClient, type ApiResponse } from '@/lib/api'

export interface SysMenu {
  menuId: number
  menuName: string
  parentId: number
  orderNum: number
  path?: string
  component?: string
  query?: string
  routeName?: string
  isFrame: number
  isCache: number
  menuType: string
  visible: string
  status: string
  perms?: string
  icon?: string
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
  remark?: string
  children?: SysMenu[]
}

export interface MenuQuery {
  menuName?: string
  status?: string
}

export interface CreateMenuRequest {
  menuName: string
  parentId?: number
  orderNum?: number
  path?: string
  component?: string
  query?: string
  routeName?: string
  isFrame?: number
  isCache?: number
  menuType?: string
  visible?: string
  status?: string
  perms?: string
  icon?: string
  remark?: string
}

export interface UpdateMenuRequest {
  menuName?: string
  parentId?: number
  orderNum?: number
  path?: string
  component?: string
  query?: string
  routeName?: string
  isFrame?: number
  isCache?: number
  menuType?: string
  visible?: string
  status?: string
  perms?: string
  icon?: string
  remark?: string
}

export const menuService = {
  async getMenuTree(query?: MenuQuery): Promise<SysMenu[]> {
    const response = await apiClient.get<ApiResponse<SysMenu[]>>('/api/system/menu/tree', {
      params: query,
    })
    return response.data.data
  },

  async getAllMenus(query?: MenuQuery): Promise<SysMenu[]> {
    const response = await apiClient.get<ApiResponse<SysMenu[]>>('/api/system/menu/list', {
      params: query,
    })
    return response.data.data
  },

  async getMenuById(id: number): Promise<SysMenu> {
    const response = await apiClient.get<ApiResponse<SysMenu>>(`/api/system/menu/${id}`)
    return response.data.data
  },

  async getMenusByRoleId(roleId: number): Promise<SysMenu[]> {
    const response = await apiClient.get<ApiResponse<SysMenu[]>>(
      `/api/system/menu/role/${roleId}`
    )
    return response.data.data
  },

  async createMenu(data: CreateMenuRequest): Promise<{ menuId: number }> {
    const response = await apiClient.post<ApiResponse<{ menuId: number }>>(
      '/api/system/menu',
      data
    )
    return response.data.data
  },

  async updateMenu(id: number, data: UpdateMenuRequest): Promise<void> {
    await apiClient.put<ApiResponse>(`/api/system/menu/${id}`, data)
  },

  async deleteMenu(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/api/system/menu/${id}`)
  },
}
