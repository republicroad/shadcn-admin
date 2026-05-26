import { createFileRoute } from '@tanstack/react-router'
import  { ZenExpressionDocs }  from '@/features/docs/zen'

export const Route = createFileRoute('/_authenticated/docs/zen')({
  component: ZenExpressionDocs,
})
