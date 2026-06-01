import * as React from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LexiconCreateDialog } from '../components/lexicon-create-dialog'
import { LexiconListTable } from '../components/lexicon-list-table'
import { LexiconPageLayout } from '../components/lexicon-page-layout'
import { LexiconPagination } from '../components/lexicon-pagination'
import { LexiconToolbar } from '../components/lexicon-toolbar'
import { LEXICON_PAGE_SIZE, LEXICON_USER_ID } from '../constants'
import {
  useCreateLexicon,
  useDeleteLexicon,
  useLexicons,
} from '../hooks/use-lexicon'

export default function LexiconList() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [createOpen, setCreateOpen] = React.useState(false)

  const { data, isError, isLoading } = useLexicons({
    userId: LEXICON_USER_ID,
    current: currentPage,
    pageSize: LEXICON_PAGE_SIZE,
    search: searchTerm,
  })
  const createMutation = useCreateLexicon()
  const deleteMutation = useDeleteLexicon()

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const lexicons = data?.metadata ?? []
  const total = data?.pagination.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / LEXICON_PAGE_SIZE))
  const deletingLexiconId = deleteMutation.isPending
    ? deleteMutation.variables?.lexiconId
    : undefined

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleCreateLexicon = React.useCallback(
    async (lexiconName: string) => {
      await createMutation.mutateAsync({
        userId: LEXICON_USER_ID,
        lexiconName,
      })
      setCreateOpen(false)
      toast.success('词库创建成功')
    },
    [createMutation]
  )

  const handleDeleteLexicon = React.useCallback(
    async (lexiconId: string) => {
      await deleteMutation.mutateAsync({ userId: LEXICON_USER_ID, lexiconId })
      toast.success('词库删除成功')
    },
    [deleteMutation]
  )

  return (
    <>
      <LexiconPageLayout
        title='词库列表'
        description=''
      >
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <LexiconToolbar
            value={searchTerm}
            placeholder='请输入词库名称进行搜索'
            onValueChange={setSearchTerm}
          />
          <Button onClick={() => setCreateOpen(true)}>
            <span>创建词库</span>
            <Plus className='ml-1 h-4 w-4' />
          </Button>
        </div>

        <LexiconListTable
          lexicons={lexicons}
          isError={isError}
          isLoading={isLoading}
          deletingId={deletingLexiconId}
          onDelete={handleDeleteLexicon}
        />

        <LexiconPagination
          currentPage={currentPage}
          total={total}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </LexiconPageLayout>

      <LexiconCreateDialog
        open={createOpen}
        isSubmitting={createMutation.isPending}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateLexicon}
      />
    </>
  )
}
