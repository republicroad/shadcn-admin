import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { useStatusesData } from '../data/data'
import { type Role } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { useTranslation } from 'react-i18next'

export const useRolesColumns = (): ColumnDef<Role>[] => {
  const { t } = useTranslation('roles')
  const statuses = useStatusesData()

  return [
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
      accessorKey: 'roleId',
      header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
      cell: ({ row }) => <div className='w-16'>{row.getValue('roleId')}</div>,
      enableHiding: false,
    },
    {
      accessorKey: 'roleName',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('roleName')} />,
      cell: ({ row }) => (
        <LongText className='max-w-36 ps-3'>{row.getValue('roleName')}</LongText>
      ),
      meta: {
        className: cn(
          'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]'
        ),
      },
      enableHiding: false,
    },
    {
      accessorKey: 'roleKey',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('roleKey')} />,
      cell: ({ row }) => <LongText className='max-w-36'>{row.getValue('roleKey')}</LongText>,
    },
    {
      accessorKey: 'roleSort',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('sort')} />,
      cell: ({ row }) => <div>{row.getValue('roleSort')}</div>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('status')} />,
      cell: ({ row }) => {
        const status = statuses.find((s) => s.value === row.getValue('status'))
        return (
          <Badge variant='outline' className={cn('capitalize')}>
            {status?.label || row.getValue('status')}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('createTime')} />,
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
}
