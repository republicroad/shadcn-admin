import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen, Trash2 } from 'lucide-react'
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
import { formatDateTime, type Lexicon } from '../data/api'

type LexiconListTableProps = {
  lexicons: Lexicon[]
  deletingId?: string
  isError: boolean
  isLoading: boolean
  onDelete: (lexiconId: string) => void
}

export function LexiconListTable({
  lexicons,
  deletingId,
  isError,
  isLoading,
  onDelete,
}: LexiconListTableProps) {
  return (
    <div className='overflow-hidden rounded-md border'>
      <Table>
        <TableHeader className='bg-muted/60'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='font-semibold text-muted-foreground'>
              词库名称
            </TableHead>
            <TableHead className='font-semibold text-muted-foreground'>
              词库编号
            </TableHead>
            <TableHead className='font-semibold text-muted-foreground'>
              创建时间
            </TableHead>
            <TableHead className='font-semibold text-muted-foreground'>
              修改时间
            </TableHead>
            <TableHead className='w-52 font-semibold text-muted-foreground'>
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableMessage message='正在加载词库列表...' />
          ) : isError ? (
            <TableMessage message='词库列表加载失败，请稍后重试。' />
          ) : lexicons.length === 0 ? (
            <TableMessage message='暂无匹配的词库。' />
          ) : (
            lexicons.map((lexicon) => (
              <TableRow key={lexicon.list_id}>
                <TableCell className='font-medium'>
                  <Link
                    to='/lexicon/detail'
                    search={{
                      lexicon_id: lexicon.list_id,
                      lexicon_name: lexicon.list_name,
                    }}
                    className='text-primary hover:underline'
                  >
                    {lexicon.list_name}
                  </Link>
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {lexicon.list_id}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {formatDateTime(lexicon.create_time)}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {formatDateTime(lexicon.update_time)}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm' asChild>
                      <Link
                        to='/lexicon/detail'
                        search={{
                          lexicon_id: lexicon.list_id,
                          lexicon_name: lexicon.list_name,
                        }}
                      >
                        <BookOpen className='mr-1 h-4 w-4' />
                        详情
                      </Link>
                    </Button>
                    <DeleteConfirm
                      name={lexicon.list_name}
                      disabled={deletingId === lexicon.list_id}
                      onConfirm={() => onDelete(lexicon.list_id)}
                    />
                  </div>
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
  name,
  disabled,
  onConfirm,
}: {
  name: string
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
          删除
        </Button>
      </PopoverTrigger>
      <PopoverContent side='top' align='center' className='w-64 p-3'>
        <div className='space-y-3'>
          <p className='text-sm font-medium'>是否确认删除当前词库?</p>
          <p className='text-sm font-bold text-red-600'>{name}</p>
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
              {disabled ? '删除中...' : '确定'}
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
      <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
        {message}
      </TableCell>
    </TableRow>
  )
}
