import * as React from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LexiconDataAddDialog } from '../components/lexicon-data-add-dialog'
import { LexiconDataTable } from '../components/lexicon-data-table'
import { LexiconPageLayout } from '../components/lexicon-page-layout'
import { LexiconPagination } from '../components/lexicon-pagination'
import { LexiconTestPanel } from '../components/lexicon-test-panel'
import { LexiconToolbar } from '../components/lexicon-toolbar'
import { LEXICON_PAGE_SIZE, LEXICON_USER_ID } from '../constants'
import {
  useAddLexiconData,
  useDeleteLexiconData,
  useLexiconData,
  useLexicons,
  useTestLexicon,
} from '../hooks/use-lexicon'

const route = getRouteApi('/_authenticated/lexicon/detail')

export default function LexiconDetail() {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const [currentPage, setCurrentPage] = React.useState(1)
  const [valueFilter, setValueFilter] = React.useState('')
  const [addOpen, setAddOpen] = React.useState(false)
  const [testText, setTestText] = React.useState('')
  const [matches, setMatches] = React.useState<string[]>([])

  const lexiconId = search.lexicon_id ?? ''
  const lexiconName = search.lexicon_name ?? ''

  const { data: lexiconList } = useLexicons({
    userId: LEXICON_USER_ID,
    current: 1,
    pageSize: 1000,
  })
  const { data, isError, isLoading } = useLexiconData({
    userId: LEXICON_USER_ID,
    lexiconId,
    current: currentPage,
    pageSize: LEXICON_PAGE_SIZE,
    value: valueFilter,
  })
  const addMutation = useAddLexiconData()
  const deleteMutation = useDeleteLexiconData()
  const testMutation = useTestLexicon()

  const rows = data?.metadata ?? []
  const total = data?.pagination.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / LEXICON_PAGE_SIZE))
  const visibleCurrentPage = Math.min(currentPage, totalPages)
  const lexicons = React.useMemo(
    () => lexiconList?.metadata ?? [],
    [lexiconList?.metadata]
  )
  const selectedLexiconName =
    lexiconName ||
    lexicons.find((item) => item.list_id === lexiconId)?.list_name ||
    lexiconId
  const deletingDataId = deleteMutation.isPending
    ? deleteMutation.variables?.dataId
    : undefined

  const handleValueFilterChange = React.useCallback((value: string) => {
    setValueFilter(value)
    setCurrentPage(1)
  }, [])

  const handleSelectLexicon = React.useCallback(
    (value: string) => {
      const nextLexicon = lexicons.find((item) => item.list_id === value)
      setCurrentPage(1)
      setMatches([])
      setTestText('')
      navigate({
        search: {
          lexicon_id: value,
          lexicon_name: nextLexicon?.list_name ?? '',
        },
      })
    },
    [lexicons, navigate]
  )

  const handleAddLexiconData = React.useCallback(
    async ({ value, tag }: { value: string; tag: string }) => {
      await addMutation.mutateAsync({
        userId: LEXICON_USER_ID,
        lexiconId,
        lexiconName: selectedLexiconName,
        value,
        tag,
      })
      setAddOpen(false)
      toast.success('词语添加成功')
    },
    [addMutation, lexiconId, selectedLexiconName]
  )

  const handleDeleteLexiconData = React.useCallback(
    async (dataId: number) => {
      await deleteMutation.mutateAsync({
        userId: LEXICON_USER_ID,
        lexiconId,
        dataId,
      })
      if (rows.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      toast.success('词语删除成功')
    },
    [currentPage, deleteMutation, lexiconId, rows.length]
  )

  const handlePageChange = React.useCallback(
    (page: number) => {
      setCurrentPage(Math.min(page, totalPages))
    },
    [totalPages]
  )

  const handleTestLexicon = React.useCallback(async () => {
    const result = await testMutation.mutateAsync({
      userId: LEXICON_USER_ID,
      lexiconId,
      text: testText,
    })
    setMatches(result)
    toast.success(`命中 ${result.length} 个词语`)
  }, [lexiconId, testMutation, testText])

  return (
    <>
      <LexiconPageLayout title='词库详情' description=''>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex flex-1 flex-wrap items-center gap-2'>
            <Select value={lexiconId} onValueChange={handleSelectLexicon}>
              <SelectTrigger className='w-full sm:w-64'>
                <SelectValue placeholder='请选择词库' />
              </SelectTrigger>
              <SelectContent>
                {lexicons.map((item) => (
                  <SelectItem key={item.list_id} value={item.list_id}>
                    {item.list_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <LexiconToolbar
              className='w-full sm:w-72'
              value={valueFilter}
              placeholder='请输入词语进行搜索'
              onValueChange={handleValueFilterChange}
            />
          </div>

          <Button disabled={!lexiconId} onClick={() => setAddOpen(true)}>
            <span>添加词语</span>
            <Plus className='ml-1 h-4 w-4' />
          </Button>
        </div>

        {!lexiconId ? (
          <div className='rounded-md border py-16 text-center text-muted-foreground'>
            请先选择词库。
          </div>
        ) : (
          <>
            <LexiconDataTable
              rows={rows}
              isError={isError}
              isLoading={isLoading}
              deletingId={deletingDataId}
              onDelete={handleDeleteLexiconData}
            />

            <LexiconPagination
              currentPage={visibleCurrentPage}
              total={total}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            <LexiconTestPanel
              lexiconName={selectedLexiconName}
              matches={matches}
              testText={testText}
              isTesting={testMutation.isPending}
              onTestTextChange={setTestText}
              onTest={handleTestLexicon}
            />
          </>
        )}
      </LexiconPageLayout>

      <LexiconDataAddDialog
        open={addOpen}
        isSubmitting={addMutation.isPending}
        onOpenChange={setAddOpen}
        onSubmit={handleAddLexiconData}
      />
    </>
  )
}
