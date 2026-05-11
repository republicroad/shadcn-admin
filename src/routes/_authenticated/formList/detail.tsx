import { createFileRoute } from '@tanstack/react-router'
import { Detail } from '@/features/formList/detail'

export const Route = createFileRoute('/_authenticated/formList/detail')({
  component: Detail,
})