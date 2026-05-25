import { type ColumnDef } from '@tanstack/react-table'
import { LongText } from '@/components/long-text'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type detailList } from '../data/schema'
import { DataTableRowActions  } from './data-table-row-actions'

export const detailColumns: ColumnDef<detailList>[] = [
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
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'list_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='名单名称' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('list_name')}</LongText>
    ),
    enableHiding: false,
    enableSorting: false
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='名单数据' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('value')}</LongText>
    ),
    enableHiding: false,
    enableSorting: false
  },
  {
    accessorKey: 'tag',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='备注' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('tag')}</LongText>
    ),
    enableHiding: false,
    enableSorting: false
  },
  {
    accessorKey: 'ttl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='过期时间(秒)' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('ttl')}</div>
    ),
    enableSorting: false
  },
  {
    accessorKey: 'create_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='创建时间' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('create_time')}</div>
    ),
    enableSorting: false
  },

  
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
