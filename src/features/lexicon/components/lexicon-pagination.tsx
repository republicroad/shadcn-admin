import { Button } from '@/components/ui/button'

type LexiconPaginationProps = {
  currentPage: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function LexiconPagination({
  currentPage,
  total,
  totalPages,
  onPageChange,
}: LexiconPaginationProps) {
  return (
    <div className='flex items-center justify-between text-sm text-muted-foreground'>
      <span>
        共 {total} 条，当前第 {Math.min(currentPage, totalPages)} /{' '}
        {totalPages} 页
      </span>
      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          上一页
        </Button>
        <Button
          variant='outline'
          size='sm'
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          下一页
        </Button>
      </div>
    </div>
  )
}
