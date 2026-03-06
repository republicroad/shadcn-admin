import { deptService } from '@/services'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeptsDeleteDialog } from './depts-provider'

export function DeptsDeleteDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { open, setOpen, currentRow } = useDeptsDeleteDialog()

  const handleDelete = async () => {
    if (!currentRow) return
    try {
      await deptService.deleteDept(currentRow.deptId)
      toast.success('Department deleted successfully')
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
      title='Delete Department'
      desc={`Are you sure you want to delete department "${currentRow?.deptName}"? This action cannot be undone.`}
      confirmText='Delete'
      destructive
    />
  )
}
