import { type Row } from '@tanstack/react-table'
import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type SysUser } from '@/services'
import { useUsers } from './users-provider'
import { useTranslation } from 'react-i18next'

type DataTableRowActionsProps = {
  row: Row<SysUser>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsers()
  const { t } = useTranslation('users')

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        className='h-8 gap-1.5 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900'
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('edit')
        }}
      >
        <Pencil className='h-3.5 w-3.5' />
        <span>{t('edit')}</span>
      </Button>

      <Button
        variant='outline'
        size='sm'
        className='h-8 gap-1.5 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900'
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('delete')
        }}
      >
        <Trash2 className='h-3.5 w-3.5' />
        <span>{t('delete')}</span>
      </Button>
    </div>
  )
}
