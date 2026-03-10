import { roleService } from '@/services'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useRolesDeleteDialog, useRolesMultiDeleteDialog } from './roles-provider'
import { type Row } from '@tanstack/react-table'
import { type Role } from '../data/schema'

export function RolesDeleteDialog({ onSuccess }: { onSuccess?: () => void }) {
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
      title='Delete Role'
      desc={`Are you sure you want to delete role "${currentRow?.roleName}"? This action cannot be undone.`}
      confirmText='Delete'
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
      title='Delete Roles'
      desc={`Are you sure you want to delete ${rows.length} role(s)? This action cannot be undone.`}
      confirmText='Delete'
      destructive
    />
  )
}
