import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { LongText } from '@/components/long-text'
import { Project } from '../data/schema'

export const projectsColumns: ColumnDef<Project>[] = [
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
      <DataTableColumnHeader column={column} title='Project Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('name')}</LongText>
    ),
  },
  {
    accessorKey: 'projectId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Project ID' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('projectId')}</LongText>
    ),
  },
  {
    accessorKey: 'ruleCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rule Count' />
    ),
    cell: ({ row }) => (
      <div className='ps-3'>{row.getValue('ruleCount')}</div>
    ),
  },
  {
    accessorKey: 'updateTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Update Time' />
    ),
    cell: ({ row }) => (
      <div className='ps-3'>{row.getValue('updateTime')}</div>
    ),
  },
]