import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type SysUser } from '@/services'
import { useTranslation } from 'react-i18next'
import { DataTableRowActions } from './data-table-row-actions'

export function useUsersColumns(): ColumnDef<SysUser>[] {
  const { t } = useTranslation('users')

  const statuses = [
    { value: '0', label: t('statusNormal'), color: 'text-green-600' },
    { value: '1', label: t('statusDisabled'), color: 'text-red-600' },
  ]

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
      accessorKey: 'userId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('userId')} />
      ),
      cell: ({ row }) => <div className='w-16'>{row.getValue('userId')}</div>,
      enableHiding: false,
    },
    {
      accessorKey: 'userName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('userName')} />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-36 ps-3'>{row.getValue('userName')}</LongText>
      ),
      meta: {
        className: cn(
          'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]'
        ),
      },
      enableHiding: false,
    },
    {
      accessorKey: 'nickName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('nickName')} />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-36'>{row.getValue('nickName')}</LongText>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('email')} />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-48'>{row.getValue('email') || '-'}</LongText>
      ),
    },
    {
      accessorKey: 'phonenumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('phone')} />
      ),
      cell: ({ row }) => <div>{row.getValue('phonenumber') || '-'}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('status')} />
      ),
      cell: ({ row }) => {
        const status = statuses.find((s) => s.value === row.getValue('status'))
        return (
          <Badge variant='outline' className={cn('capitalize', status?.color)}>
            {status?.label || row.getValue('status')}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'createTime',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('createTime')} />
      ),
      cell: ({ row }) => {
        const date = row.getValue('createTime') as string
        return <div className='text-nowrap'>{date ? new Date(date).toLocaleString() : '-'}</div>
      },
    },
    {
      id: 'actions',
      header: t('common:actions'),
      cell: DataTableRowActions,
      enableHiding: false,
      size: 180,
    },
  ]
}
