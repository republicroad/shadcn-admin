import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Project } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const tasksColumns: ColumnDef<Project>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='场景名称' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-56 font-medium'>
        {row.getValue('name')}
      </LongText>
    ),
  },
  {
    accessorKey: 'projectId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='场景编号' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64 text-muted-foreground'>
        {row.getValue('projectId')}
      </LongText>
    ),
  },
  {
    accessorKey: 'ruleCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='场景规则数量' />
    ),
    cell: ({ row }) => (
      <Badge
        variant='secondary'
        className='bg-blue-100 text-blue-700 hover:bg-blue-200'
      >
        {row.getValue('ruleCount')}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)))
    },
  },
  {
    accessorKey: 'updateTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='修改时间' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {row.getValue('updateTime')}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
]
