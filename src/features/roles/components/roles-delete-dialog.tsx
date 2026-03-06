import { roleService } from '@/services'
import { toast } from 'sonner'
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
      toast.success('Role deleted successfully')
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Delete failed')
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
      toast.success('Roles deleted successfully')
      setOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Delete failed')
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
