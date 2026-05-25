import { z } from 'zod'

export const PaginationSchema = z.object({
  current: z.number(),
  pageSize: z.number(),
  total: z.number(),
})

// ==========email 相关接口返回的数据结构===============

export const emailSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  email_name: z.string(),
  email: z.string(),
  tag: z.string(),
  create_time: z.coerce.date(),
  update_time: z.coerce.date(),
})

export const emailListDataSchema = z.object({
  metadata: z.array(emailSchema),
  pagination: PaginationSchema,
})

export const emailQueryResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: emailListDataSchema,
})

// ==========feishu 相关接口返回的数据结构============
export const feishuSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  feishu_name: z.string(),
  feishu_url: z.string(),
  key: z.string(),
  tag: z.string(),
  create_time: z.coerce.date(),
  update_time: z.coerce.date(),
})

export const feishuListDataSchema = z.object({
  metadata: z.array(feishuSchema),
  pagination: PaginationSchema,
})

export const feishuQueryResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: feishuListDataSchema,
})

// ==========dingtalk 相关接口返回的数据结构============
export const dingtalkSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  dingtalk_name: z.string(),
  dingtalk_url: z.string(),
  key: z.string(),
  tag: z.string(),
  create_time: z.coerce.date(),
  update_time: z.coerce.date(),
})

export const dingtalkListDataSchema = z.object({
  metadata: z.array(dingtalkSchema),
  pagination: PaginationSchema,
})

export const dingtalkQueryResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: dingtalkListDataSchema,
})

// ==========webhook 相关接口返回的数据结构============
export const webhookSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  webhook_name: z.string(),
  webhook_url: z.string(),
  secret_key: z.string(),
  secret_value: z.string(),
  tag: z.string(),
  create_time: z.coerce.date(),
  update_time: z.coerce.date(),
})

export const webhookListDataSchema = z.object({
  metadata: z.array(webhookSchema),
  pagination: PaginationSchema,
})

export const webhookQueryResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: webhookListDataSchema,
})

export type Email = z.infer<typeof emailSchema>
export type EmailQueryResponse = z.infer<typeof emailQueryResponseSchema>

export type Feishu = z.infer<typeof feishuSchema>
export type FeishuQueryResponse = z.infer<typeof feishuQueryResponseSchema>

export type Dingtalk = z.infer<typeof dingtalkSchema>
export type DingtalkQueryResponse = z.infer<typeof dingtalkQueryResponseSchema>

export type Webhook = z.infer<typeof webhookSchema>
export type WebhookQueryResponse = z.infer<typeof webhookQueryResponseSchema>
