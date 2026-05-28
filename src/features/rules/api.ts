import { z } from 'zod'
import apiClient from './lib/api-client'

export interface Proj {
  proj_id: string
  proj_name: string
  [key: string]: unknown
}

export interface Rule {
  rule_id: string
  proj_id: string
  rule_name: string
  rule_status: 'active' | 'watch' | 'close'
  rule_desc: string
  create_time: string
  update_time: string
  [key: string]: unknown
}

type RuleDetail = Rule & { rule_graph: unknown }

const projSchema = z
  .object({
    proj_id: z.string(),
    proj_name: z.string(),
  })
  .passthrough()

const ruleSchema = z
  .object({
    rule_id: z.string(),
    proj_id: z.string(),
    rule_name: z.string(),
    rule_status: z.enum(['active', 'watch', 'close']),
    rule_desc: z.string().catch(''),
    create_time: z.union([z.string(), z.coerce.string()]).catch(''),
    update_time: z.union([z.string(), z.coerce.string()]).catch(''),
  })
  .passthrough()

const ruleDetailSchema = ruleSchema.extend({
  rule_graph: z.unknown().optional().default({}),
})

function getRulesDataContainer(payload: unknown): unknown {
  if (!payload || typeof payload !== 'object') return payload
  if ('data' in payload) return payload.data
  return payload
}

function getRulesMetadataArray(payload: unknown): unknown[] {
  const container = getRulesDataContainer(payload)

  if (Array.isArray(container)) return container

  if (
    container &&
    typeof container === 'object' &&
    'metadata' in container &&
    Array.isArray(container.metadata)
  ) {
    return container.metadata
  }

  return []
}

function assertRulesRequestSucceeded(payload: unknown, fallbackMessage: string) {
  if (!payload || typeof payload !== 'object') return

  const status =
    'status' in payload && typeof payload.status === 'number'
      ? payload.status
      : undefined
  const code =
    'code' in payload && typeof payload.code === 'number'
      ? payload.code
      : undefined
  const message =
    ('message' in payload && typeof payload.message === 'string'
      ? payload.message
      : undefined) ||
    ('msg' in payload && typeof payload.msg === 'string'
      ? payload.msg
      : undefined)

  const hasErrorStatus =
    (typeof status === 'number' && status !== 0 && status !== 200) ||
    (typeof code === 'number' && code !== 0 && code !== 200)

  if (hasErrorStatus) {
    throw new Error(message || fallbackMessage)
  }
}

function parseProjList(payload: unknown): Proj[] {
  return getRulesMetadataArray(payload)
    .map((item) => projSchema.safeParse(item))
    .flatMap((result) => (result.success ? [result.data] : []))
}

function parseRuleList(payload: unknown): Rule[] {
  return getRulesMetadataArray(payload)
    .map((item) => ruleSchema.safeParse(item))
    .flatMap((result) => (result.success ? [result.data] : []))
}

function parseRuleDetail(payload: unknown): RuleDetail {
  const metadata = getRulesMetadataArray(payload)

  if (metadata.length > 0) {
    return ruleDetailSchema.parse(metadata[0])
  }

  const container = getRulesDataContainer(payload)

  if (container && typeof container === 'object' && !Array.isArray(container)) {
    return ruleDetailSchema.parse(container)
  }

  throw new Error('规则详情不存在')
}

function getApiOrigin() {
  const configuredBase = (
    import.meta.env.VITE_API_URL
  )?.trim()

  if (configuredBase) {
    return configuredBase.replace(/\/$/, '')
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return ''
}

export function getRulesApiBaseUrl() {
  return `${getApiOrigin()}/geerule`
}

export async function fetchProjs(userId: string): Promise<Proj[]> {
  const response = await apiClient.get('/geerule/proj', {
    params: { user_id: userId },
  })
  assertRulesRequestSucceeded(response.data, '获取场景列表失败')
  return parseProjList(response.data)
}

export async function fetchRules(
  userId: string,
  projId: string
): Promise<Rule[]> {
  const response = await apiClient.get('/geerule/rule', {
    params: { user_id: userId, proj_id: projId, current: 1, page_size: 100 },
  })
  assertRulesRequestSucceeded(response.data, '获取规则列表失败')
  return parseRuleList(response.data)
}

export async function fetchRuleDetail(
  userId: string,
  projId: string,
  ruleId: string
): Promise<RuleDetail> {
  const response = await apiClient.get('/geerule/rule', {
    params: { user_id: userId, proj_id: projId, rule_id: ruleId },
  })
  assertRulesRequestSucceeded(response.data, '获取规则详情失败')
  return parseRuleDetail(response.data)
}

export async function createRule(
  userId: string,
  projId: string,
  fields: { rule_name: string; rule_desc: string; rule_graph: string }
): Promise<void> {
  const response = await apiClient.post('/geerule/rule', {
    user_id: userId,
    proj_id: projId,
    rule_name: fields.rule_name,
    rule_desc: fields.rule_desc,
    rule_graph: fields.rule_graph,
  })
  assertRulesRequestSucceeded(response.data, '创建规则失败')
}

export async function updateRule(
  userId: string,
  projId: string,
  ruleId: string,
  fields: { rule_name?: string; rule_desc?: string; rule_graph?: string }
): Promise<void> {
  const response = await apiClient.put('/geerule/rule', fields, {
    params: { user_id: userId, proj_id: projId, rule_id: ruleId },
  })
  assertRulesRequestSucceeded(response.data, '更新规则失败')
}

export async function updateRuleStatus(
  userId: string,
  projId: string,
  ruleId: string,
  ruleStatus: string
): Promise<void> {
  const response = await apiClient.put(
    '/geerule/rule',
    { rule_status: ruleStatus },
    {
      params: { user_id: userId, proj_id: projId, rule_id: ruleId },
    }
  )
  assertRulesRequestSucceeded(response.data, '更新规则状态失败')
}

export async function deleteRule(
  userId: string,
  ruleId: string,
  projId?: string
): Promise<void> {
  const response = await apiClient.delete('/geerule/rule', {
    params: {
      user_id: userId,
      rule_id: ruleId,
      ...(projId ? { proj_id: projId } : {}),
    },
  })
  assertRulesRequestSucceeded(response.data, '删除规则失败')
}

export async function runRule(
  params: { user_id: string; user_key: string; proj_id: string },
  data: unknown
): Promise<unknown> {
  const response = await apiClient.post('/geerule/run', data, { params })
  assertRulesRequestSucceeded(response.data, '运行规则失败')
  return response.data
}
