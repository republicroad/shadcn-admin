import { roleService } from '@/services'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useRolesDeleteDialog, useRolesMultiDeleteDialog } from './roles-provider'
import { type Row } from '@tanstack/react-table'
import { type Role } from '../data/schema'
import { useTranslation } from 'react-i18next'

export function RolesDeleteDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation('roles')
  const { open, setOpen, currentRow } = useRolesDeleteDialog()

  const handleDelete = async () => {
    if (!currentRow) return
    try {
      await roleService.deleteRole(currentRow.roleId)
      setOpen(false)
      onSuccess?.()
    } catch {
      // errors handled by api interceptor
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      handleConfirm={handleDelete}
      title={t('deleteRole')}
      desc={t('deleteConfirm', { name: currentRow?.roleName })}
      confirmText={t('delete')}
      destructive
    />
  )
}

export function RolesMultiDeleteDialog({
  rows,
  onSuccess,
}: {
  rows: Row<Role>[]
  onSuccess?: () => void
}) {
  const { t } = useTranslation('roles')
  const { open, setOpen } = useRolesMultiDeleteDialog()

  const handleDelete = async () => {
    try {
      const ids = rows.map((r) => r.original.roleId)
      await roleService.deleteRoles(ids)
      setOpen(false)
      onSuccess?.()
    } catch {
      // errors handled by api interceptor
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      handleConfirm={handleDelete}
      title={t('deleteRoles')}
      desc={t('deleteMultiConfirm', { count: rows.length })}
      confirmText={t('delete')}
      destructive
    />
  )
}
