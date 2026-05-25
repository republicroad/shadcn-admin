import { createFileRoute } from '@tanstack/react-router'
import DetailList  from '@/features/formList/detail'

export const Route = createFileRoute('/_authenticated/formList/detail')({
  component: DetailList,
})