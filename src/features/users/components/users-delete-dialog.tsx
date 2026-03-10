'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type SysUser, userService } from '@/services'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: SysUser
  onSuccess?: () => void
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: UserDeleteDialogProps) {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(['users', 'common'])

  const handleDelete = async () => {
    setLoading(true)
    try {
      await userService.deleteUser(currentRow.userId)
      toast.success(t('success.deleted'))
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
          {t('deleteDialog.title')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            <span dangerouslySetInnerHTML={{
              __html: t('deleteDialog.description', {
                userName: currentRow.userName,
                nickName: currentRow.nickName
              })
            }} />
            <br />
            {t('deleteDialog.warning')}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('deleteDialog.warningTitle')}!</AlertTitle>
            <AlertDescription>
              {t('deleteDialog.cannotUndo')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('common:delete')}
      destructive
    />
  )
}
