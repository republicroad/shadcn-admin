import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Notifications } from '@/features/notifications/index'

const notificationsSearchSchema = z.object({
  channel: z
    .enum(['email', 'feishu', 'dingtalk', 'webhook'])
    .optional()
    .catch('email'),
})

export const Route = createFileRoute('/_authenticated/notifications/')({
  validateSearch: notificationsSearchSchema,
  component: Notifications,
})
