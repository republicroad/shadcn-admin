import { z } from 'zod'
import api from '@/shared/apiClient'
import { projectSchema, type Project } from './schema'

const backendProjectSchema = z.object({
  proj_id: z.string(),
  proj_name: z.string(),
  rule_count: z.number().optional().default(0),
  update_time: z.union([z.string(), z.coerce.string()]),
})

const projectsResponseSchema = z.object({
  status: z.number(),
  data: z.object({
    metadata: z.array(backendProjectSchema),
    pagination: z.object({
      current: z.number(),
      pageSize: z.number(),
      total: z.number(),
    }),
  }),
})

const projectMutationResponseSchema = z.object({
  status: z.number(),
  data: z.boolean(),
  message: z.string().optional(),
})

export type FetchProjectsParams = {
  userId: string
  current: number
  pageSize: number
  search?: string
}

export type FetchProjectsResult = {
  projects: Project[]
  pagination: {
    current: number
    pageSize: number
    total: number
  }
}

export type CreateProjectPayload = {
  userId: string
  name: string
}

export type DeleteProjectPayload = {
  userId: string
  projectId: string
}

export async function fetchProjects({
  userId,
  current,
  pageSize,
  search = '',
}: FetchProjectsParams): Promise<FetchProjectsResult> {
  const result = await requestProjectApi(
    '/api/project/project_list',
    projectsResponseSchema,
    '获取场景列表失败',
    {
      method: 'GET',
      params: {
        user_id: userId,
        current,
        page_size: pageSize,
        search,
      },
    }
  )

  return {
    projects: result.data.metadata.map((project) =>
      projectSchema.parse({
        id: project.proj_id,
        name: project.proj_name,
        projectId: project.proj_id,
        ruleCount: project.rule_count,
        updateTime: formatProjectTime(project.update_time),
      })
    ),
    pagination: result.data.pagination,
  }
}

export async function createProject({ userId, name }: CreateProjectPayload) {
  const result = await requestProjectApi(
    '/api/project/project_create',
    projectMutationResponseSchema,
    '创建场景失败',
    {
      method: 'POST',
      data: {
        user_id: userId,
        proj_name: name,
      },
    }
  )

  assertMutationSucceeded(result, '创建场景失败')

  return result
}

export async function deleteProject({
  userId,
  projectId,
}: DeleteProjectPayload) {
  const result = await requestProjectApi(
    '/api/project/project_delete',
    projectMutationResponseSchema,
    '删除场景失败',
    {
      method: 'DELETE',
      params: {
        user_id: userId,
        proj_id: projectId,
      },
    }
  )

  assertMutationSucceeded(result, '删除场景失败')

  return result
}

async function requestProjectApi<TSchema extends z.ZodType>(
  url: string,
  schema: TSchema,
  errorMessage: string,
  config?: {
    method: 'GET' | 'POST' | 'DELETE'
    params?: Record<string, unknown>
    data?: unknown
  }
): Promise<z.infer<TSchema>> {
  try {
    const response = await api.request({
      url,
      method: config?.method ?? 'GET',
      params: config?.params,
      data: config?.data,
    })
    return schema.parse(response.data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error
    }
    throw new Error(errorMessage)
  }
}

function assertMutationSucceeded(
  result: z.infer<typeof projectMutationResponseSchema>,
  fallbackMessage: string
) {
  if (result.status !== 0 || result.data !== true) {
    throw new Error(result.message || fallbackMessage)
  }
}

function formatProjectTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = padTimePart(date.getMonth() + 1)
  const day = padTimePart(date.getDate())
  const hour = padTimePart(date.getHours())
  const minute = padTimePart(date.getMinutes())

  return `${year}/${month}/${day} ${hour}:${minute}`
}

function padTimePart(value: number) {
  return String(value).padStart(2, '0')
}
