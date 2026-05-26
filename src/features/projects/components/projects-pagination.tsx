import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'

type ProjectsPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ProjectsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProjectsPaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages)
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className='flex justify-center'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant='ghost'
              disabled={!canGoPrevious}
              onClick={() => onPageChange(currentPage - 1)}
              className='h-10 px-4 py-2 text-sm'
            >
              <ChevronLeft className='mr-2 h-4 w-4' />
              上一页
            </Button>
          </PaginationItem>

          {pages[0] > 1 && (
            <>
              <PageLink
                page={1}
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
              {pages[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {pages.map((page) => (
            <PageLink
              key={page}
              page={page}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          ))}

          {pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PageLink
                page={totalPages}
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
            </>
          )}

          <PaginationItem>
            <Button
              variant='ghost'
              disabled={!canGoNext}
              onClick={() => onPageChange(currentPage + 1)}
              className='h-10 px-4 py-2 text-sm'
            >
              下一页
              <ChevronRight className='ml-2 h-4 w-4' />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function PageLink({
  page,
  currentPage,
  onPageChange,
}: {
  page: number
  currentPage: number
  onPageChange: (page: number) => void
}) {
  return (
    <PaginationItem>
      <PaginationLink
        href='#'
        isActive={currentPage === page}
        onClick={(event) => {
          event.preventDefault()
          onPageChange(page)
        }}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  )
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5
  const halfWindow = Math.floor(maxVisiblePages / 2)
  const startPage = Math.max(1, currentPage - halfWindow)
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1)

  return Array.from(
    { length: endPage - adjustedStartPage + 1 },
    (_, index) => adjustedStartPage + index
  )
}
