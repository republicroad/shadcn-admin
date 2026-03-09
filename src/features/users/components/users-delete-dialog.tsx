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
  const { t } = useTranslation('users')

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
          Delete User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete user{' '}
            <span className='font-bold'>{currentRow.userName}</span> ({currentRow.nickName})?
            <br />
            This action will permanently remove the user from the system.
          </p>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              This operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
