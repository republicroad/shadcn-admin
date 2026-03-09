'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type SysUser, userService } from '@/services'
import { useTranslation } from 'react-i18next'

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
  onSuccess?: () => void
}

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
  onSuccess,
}: UserMultiDeleteDialogProps<TData>) {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(['users', 'common'])

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    setLoading(true)
    try {
      // 获取选中用户的 ID
      const userIds = selectedRows.map((row) => (row.original as SysUser).userId)

      // 调用批量删除 API
      await userService.deleteUsers(userIds)

      toast.success(
        `${t('success.deleted')} ${selectedRows.length} ${
          selectedRows.length > 1 ? t('deleteUsers') : t('deleteUser')
        }`
      )

      table.resetRowSelection()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.msg || t('errors.deleteFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={loading}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('deleteUsers')} ({selectedRows.length})
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('deleteUsers')} {selectedRows.length} {selectedRows.length > 1 ? t('deleteUsers') : t('deleteUser')}?
            <br />
            {selectedRows.length > 0 && (
              <span className='mt-2 block text-sm text-muted-foreground'>
                {selectedRows.slice(0, 5).map((row) => (row.original as SysUser).userName).join(', ')}
                {selectedRows.length > 5 && ` ... (+${selectedRows.length - 5})`}
              </span>
            )}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('common:warning') || 'Warning'}!</AlertTitle>
            <AlertDescription>
              {t('common:cannotUndo') || 'This operation cannot be undone.'}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('common:delete') || 'Delete'}
      destructive
    />
  )
}
