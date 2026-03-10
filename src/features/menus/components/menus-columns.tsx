import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { statuses, menuTypes } from '../data/data'
import { type Menu } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const menusColumns: ColumnDef<Menu>[] = [
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
    accessorKey: 'menuId',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({ row }) => <div className='w-16'>{row.getValue('menuId')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'menuName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Menu Name' />,
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('menuName')}</LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'icon',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Icon' />,
    cell: ({ row }) => <div>{row.getValue('icon') || '-'}</div>,
  },
  {
    accessorKey: 'orderNum',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sort' />,
    cell: ({ row }) => <div>{row.getValue('orderNum') || 0}</div>,
  },
  {
    accessorKey: 'perms',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Permission' />,
    cell: ({ row }) => <LongText className='max-w-36'>{row.getValue('perms') || '-'}</LongText>,
  },
  {
    accessorKey: 'path',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Path' />,
    cell: ({ row }) => <LongText className='max-w-36'>{row.getValue('path') || '-'}</LongText>,
  },
  {
    accessorKey: 'menuType',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
    cell: ({ row }) => {
      const type = menuTypes.find((t) => t.value === row.getValue('menuType'))
      return <Badge variant='outline'>{type?.label || row.getValue('menuType')}</Badge>
    },
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
