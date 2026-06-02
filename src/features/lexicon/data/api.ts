import { z } from 'zod'
import api from '@/shared/apiClient'

const lexiconSchema = z.object({
  list_id: z.string(),
  list_name: z.string(),
  create_time: z.coerce.string().optional(),
  update_time: z.coerce.string().optional(),
})

const lexiconDataSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  lexicon_id: z.string(),
  lexicon_name: z.string().optional().nullable(),
  value: z.string(),
  tag: z.string().optional().nullable(),
  create_time: z.coerce.string().optional(),
  start_time: z.coerce.string().optional().nullable(),
  end_time: z.coerce.string().optional().nullable(),
})

const paginationSchema = z.object({
  current: z.number(),
  pageSize: z.number(),
  total: z.number(),
})

const lexiconListResponseSchema = z.object({
  status: z.number(),
  data: z.object({
    metadata: z.array(lexiconSchema),
    pagination: paginationSchema,
  }),
  message: z.string().optional(),
})

const lexiconDataResponseSchema = z.object({
  status: z.number(),
  data: z.object({
    metadata: z.array(lexiconDataSchema),
    pagination: paginationSchema,
  }),
  message: z.string().optional(),
})

const mutationResponseSchema = z.object({
  status: z.number(),
  data: z.unknown(),
  message: z.string().optional(),
})

const lexiconTestResponseSchema = z.object({
  status: z.number(),
  data: z.array(z.string()),
  message: z.string().optional(),
})

export type Lexicon = z.infer<typeof lexiconSchema>
export type LexiconData = z.infer<typeof lexiconDataSchema>
export type Pagination = z.infer<typeof paginationSchema>

export type FetchLexiconsParams = {
  userId: string
  current: number
  pageSize: number
  search?: string
}

export type CreateLexiconParams = {
  userId: string
  lexiconName: string
}

export type DeleteLexiconParams = {
  userId: string
  lexiconId: string
}

export type FetchLexiconDataParams = {
  userId: string
  lexiconId: string
  current: number
  pageSize: number
  value?: string
  tag?: string
}

export type AddLexiconDataParams = {
  userId: string
  lexiconId: string
  lexiconName?: string
  value: string
  tag?: string
}

export type DeleteLexiconDataParams = {
  userId: string
  lexiconId: string
  dataId: number
}

export type TestLexiconParams = {
  userId: string
  lexiconId: string
  text: string
}

export async function fetchLexicons(params: FetchLexiconsParams) {
  const response = await api.get('/api/lexicon/lexicon_search', {
    params: {
      user_id: params.userId,
      current: params.current,
      page_size: params.pageSize,
      search: params.search ?? '',
    },
  })
  const result = lexiconListResponseSchema.parse(response.data)
  assertOk(result)
  return result.data
}

export async function createLexicon(params: CreateLexiconParams) {
  const response = await api.post('/api/lexicon/lexicon_create', null, {
    params: {
      user_id: params.userId,
      lexicon_name: params.lexiconName,
    },
  })
  const result = mutationResponseSchema.parse(response.data)
  assertOk(result)
  return result.data
}

export async function deleteLexicon(params: DeleteLexiconParams) {
  const response = await api.delete('/api/lexicon/lexicon_delete', {
    params: {
      user_id: params.userId,
      lexicon_id: params.lexiconId,
    },
  })
  const result = mutationResponseSchema.parse(response.data)
  assertOk(result)
  return result.data
}

export async function fetchLexiconData(params: FetchLexiconDataParams) {
  const response = await api.get('/api/lexicon/lexicon_data_search', {
    params: {
      user_id: params.userId,
      lexicon_id: params.lexiconId,
      current: params.current,
      page_size: params.pageSize,
      value: params.value ?? '',
      tag: params.tag ?? '',
    },
  })
  const result = lexiconDataResponseSchema.parse(response.data)
  assertOk(result)
  return result.data
}

export async function addLexiconData(params: AddLexiconDataParams) {
  const response = await api.post('/api/lexicon/lexicon_data_add', {
    user_id: params.userId,
    lexicon_id: params.lexiconId,
    lexicon_name: params.lexiconName ?? '',
    value: params.value,
    tag: params.tag ?? '',
  })
  const result = mutationResponseSchema.parse(response.data)
  assertOk(result)
  return result.data
}

export async function deleteLexiconData(params: DeleteLexiconDataParams) {
  const response = await api.delete('/api/lexicon/lexicon_data_delete', {
    params: {
      user_id: params.userId,
      lexicon_id: params.lexiconId,
      data_id: params.dataId,
    },
  })
  const result = mutationResponseSchema.parse(response.data)
  assertOk(result)
  return result.data
}

export async function testLexicon(params: TestLexiconParams) {
  const response = await api.post('/api/lexicon/lexicon_test', null, {
    params: {
      user_id: params.userId,
      lexicon_id: params.lexiconId,
      text: params.text,
    },
  })
  const result = lexiconTestResponseSchema.parse(response.data)
  assertOk(result)
  return result.data
}

export function formatDateTime(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())
  return `${year}/${month}/${day} ${hour}:${minute}`
}

function assertOk(result: { status: number; message?: string }) {
  if (result.status !== 0) {
    throw new Error(result.message || '请求失败')
  }
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}
