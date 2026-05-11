import { createFileRoute } from '@tanstack/react-router'
import  List  from '@/features/formList/list'

export const Route = createFileRoute('/_authenticated/formList/list')({
  component: List,
})
