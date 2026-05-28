import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RuleTest } from '@/features/rules/test'

const ruleTestSearchSchema = z.object({
  userId: z.string().optional().catch(''),
  projId: z.string().optional().catch(''),
  userKey: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/rules/test')({
  validateSearch: ruleTestSearchSchema,
  component: RuleTest,
})
