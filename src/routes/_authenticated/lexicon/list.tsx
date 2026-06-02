import { createFileRoute } from '@tanstack/react-router'
import LexiconList from '@/features/lexicon/list'

export const Route = createFileRoute('/_authenticated/lexicon/list')({
  component: LexiconList,
})
