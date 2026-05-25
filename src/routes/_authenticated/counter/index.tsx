import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Counter } from '@/features/share_counter'
import { counter_times,counter_types } from '@/features/share_counter/data/data'

const counterSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  counter_type: z
    .array(z.enum(counter_types.map((r) => r.value as (typeof counter_types)[number]['value'])))
    .optional()
    .catch([]),
   counter_time: z
    .array(z.enum(counter_times.map((r) => r.value as (typeof counter_times)[number]['value'])))
    .optional()
    .catch([]),
  // Per-column text filter (example for username)
  counter_name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/counter/')({
  validateSearch: counterSearchSchema,
  component: Counter,
})
