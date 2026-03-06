import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statuses } from '../data/data'
import { type Dept } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const deptsColumns: ColumnDef<Dept>[] = [
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
    accessorKey: 'deptId',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({ row }) => <div className='w-16'>{row.getValue('deptId')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'deptName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Department Name' />,
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('deptName')}</LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'orderNum',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sort' />,
    cell: ({ row }) => <div>{row.getValue('orderNum') || 0}</div>,
  },
  {
    accessorKey: 'leader',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Leader' />,
    cell: ({ row }) => <div>{row.getValue('leader') || '-'}</div>,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Phone' />,
    cell: ({ row }) => <div>{row.getValue('phone') || '-'}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => <LongText className='max-w-36'>{row.getValue('email') || '-'}</LongText>,
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
