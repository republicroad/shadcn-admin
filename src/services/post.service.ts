import { apiClient, type ApiResponse, type PaginatedResponse } from '@/lib/api'

export interface SysPost {
  postId: number
  postCode: string
  postName: string
  postSort: number
  status?: string
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
  remark?: string
}

export interface PostListQuery {
  postCode?: string
  postName?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface CreatePostRequest {
  postCode: string
  postName: string
  postSort: number
  status?: string
  remark?: string
}

export interface UpdatePostRequest {
  postCode?: string
  postName?: string
  postSort?: number
  status?: string
  remark?: string
}

export const postService = {
  async getPostList(query: PostListQuery): Promise<PaginatedResponse<SysPost>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<SysPost>>>(
      '/api/system/post/list',
      { params: query }
    )
    return response.data.data
  },

  async getAllPosts(): Promise<SysPost[]> {
    const response = await apiClient.get<ApiResponse<SysPost[]>>('/api/system/post/all')
    return response.data.data
  },

  async getPostById(id: number): Promise<SysPost> {
    const response = await apiClient.get<ApiResponse<SysPost>>(`/api/system/post/${id}`)
    return response.data.data
  },

  async createPost(data: CreatePostRequest): Promise<{ postId: number }> {
    const response = await apiClient.post<ApiResponse<{ postId: number }>>(
      '/api/system/post',
      data
    )
    return response.data.data
  },

  async updatePost(id: number, data: UpdatePostRequest): Promise<void> {
    await apiClient.put<ApiResponse>(`/api/system/post/${id}`, data)
  },

  async deletePost(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/api/system/post/${id}`)
  },

  async deletePosts(postIds: number[]): Promise<void> {
    await apiClient.delete<ApiResponse>('/api/system/post/batch', { data: { postIds } })
  },
}
