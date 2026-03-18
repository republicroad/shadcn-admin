import { z } from 'zod'

const counterTypeSchema = z.union([
  z.literal('group_distinct'),
  z.literal('rate')
])
export type CounterType = z.infer<typeof counterTypeSchema>

const counterTimeSchema = z.union([
  z.literal('10s'),
  z.literal('1m'),
  z.literal('5m'),
  z.literal('1h'),
  z.literal('1d'),
  z.literal('7d')
])

export type CounterTime = z.infer<typeof counterTimeSchema>

const shareCounterSchema = z.object({
  user_id: z.string(),
  counter_name: z.string(),
  counter_type: counterTypeSchema,
  counter_time: counterTimeSchema
})
export type shareCounter = z.infer<typeof shareCounterSchema>

export const shareCounterListSchema = z.array(shareCounterSchema)
