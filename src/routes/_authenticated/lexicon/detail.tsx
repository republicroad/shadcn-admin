import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import LexiconDetail from '@/features/lexicon/detail'

const lexiconDetailSearchSchema = z.object({
  lexicon_id: z.string().optional().catch(''),
  lexicon_name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/lexicon/detail')({
  validateSearch: lexiconDetailSearchSchema,
  component: LexiconDetail,
})
