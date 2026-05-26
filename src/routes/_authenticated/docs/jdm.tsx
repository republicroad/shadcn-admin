import { createFileRoute } from '@tanstack/react-router'
import  { JsonDecisionModelDocs } from '@/features/docs/jdm'

export const Route = createFileRoute('/_authenticated/docs/jdm')({
  component: JsonDecisionModelDocs,
})
