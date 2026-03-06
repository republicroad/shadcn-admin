import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statuses } from '../data/data'
import { type Post } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const postsColumns: ColumnDef<Post>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'postId',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({ row }) => <div className='w-16'>{row.getValue('postId')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'postName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Post Name' />,
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('postName')}</LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'postCode',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Post Code' />,
    cell: ({ row }) => <LongText className='max-w-36'>{row.getValue('postCode')}</LongText>,
  },
  {
    accessorKey: 'postSort',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sort' />,
    cell: ({ row }) => <div>{row.getValue('postSort')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = statuses.find((s) => s.value === row.getValue('status'))
      return <Badge variant='outline'>{status?.label || row.getValue('status')}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createTime',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Create Time' />,
    cell: ({ row }) => {
      const date = row.getValue('createTime') as string
      return <div className='text-nowrap'>{date ? new Date(date).toLocaleString() : '-'}</div>
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
