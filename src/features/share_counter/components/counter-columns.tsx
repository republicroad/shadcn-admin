import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { callTypes, counter_times, counter_types } from '../data/data'
import { type shareCounter } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const counterColumns: ColumnDef<shareCounter>[] = [
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
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
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
    accessorKey: 'counter_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='计数器名称' />
    ),
    cell: ({ row }) => (
      <LongText className='w-fit ps-2 text-nowrap'>{row.getValue('counter_name')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'counter_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='计算类型' />
    ),
    cell: ({ row }) => {
      const { counter_type } = row.original
      const badgeColor = callTypes.get(counter_type)
      const c_type = counter_types.find(({ value }) => value === counter_type)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {c_type?.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'counter_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='滑动窗口' />
    ),
    cell: ({ row }) => {
      const { counter_time } = row.original
      const c_time = counter_times.find(({ value }) => value === counter_time)
      return (
        <div className='flex space-x-2'>
          {c_time?.label}
        </div>
    )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
