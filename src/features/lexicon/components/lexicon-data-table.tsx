import * as React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime, type LexiconData } from '../data/api'

type LexiconDataTableProps = {
  rows: LexiconData[]
  deletingId?: number
  isError: boolean
  isLoading: boolean
  onDelete: (dataId: number) => void
}

export function LexiconDataTable({
  rows,
  deletingId,
  isError,
  isLoading,
  onDelete,
}: LexiconDataTableProps) {
  return (
    <div className='overflow-hidden rounded-md border'>
      <Table>
        <TableHeader className='bg-muted/60'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='font-semibold text-muted-foreground'>
              词语
            </TableHead>
            <TableHead className='font-semibold text-muted-foreground'>
              标签
            </TableHead>
            <TableHead className='font-semibold text-muted-foreground'>
              创建时间
            </TableHead>
            <TableHead className='w-28 font-semibold text-muted-foreground'>
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableMessage message='正在加载词语列表...' />
          ) : isError ? (
            <TableMessage message='词语列表加载失败，请稍后重试。' />
          ) : rows.length === 0 ? (
            <TableMessage message='暂无词语数据。' />
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className='font-medium text-foreground'>
                  {row.value}
                </TableCell>
                <TableCell>{row.tag || '-'}</TableCell>
                <TableCell className='text-muted-foreground'>
                  {formatDateTime(row.create_time)}
                </TableCell>
                <TableCell>
                  <DeleteConfirm
                    value={row.value}
                    disabled={deletingId === row.id}
                    onConfirm={() => onDelete(row.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function DeleteConfirm({
  value,
  disabled,
  onConfirm,
}: {
  value: string
  disabled?: boolean
  onConfirm: () => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          disabled={disabled}
          className='text-gray-400 hover:text-red-600'
        >
          <Trash2 className='mr-1 h-4 w-4' />
          {disabled ? '删除中...' : '删除'}
        </Button>
      </PopoverTrigger>
      <PopoverContent side='top' align='center' className='w-64 p-3'>
        <div className='space-y-3'>
          <p className='text-sm font-medium'>是否确认删除当前词语?</p>
          <p className='text-sm font-bold text-red-600'>{value}</p>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' size='sm' onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button
              variant='destructive'
              size='sm'
              disabled={disabled}
              onClick={() => {
                onConfirm()
                setOpen(false)
              }}
            >
              确定
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function TableMessage({ message }: { message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={4} className='h-24 text-center text-muted-foreground'>
        {message}
      </TableCell>
    </TableRow>
  )
}
