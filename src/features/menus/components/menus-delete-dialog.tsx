import { menuService } from '@/services'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useMenusDeleteDialog } from './menus-provider'

export function MenusDeleteDialog({ onSuccess }: { onSuccess?: () => void }) {
  const { open, setOpen, currentRow } = useMenusDeleteDialog()

  const handleDelete = async () => {
    if (!currentRow) return
    try {
      await menuService.deleteMenu(currentRow.menuId)
      toast.success('Menu deleted successfully')
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
      title='Delete Menu'
      desc={`Are you sure you want to delete menu "${currentRow?.menuName}"? This action cannot be undone.`}
      confirmText='Delete'
      destructive
    />
  )
}
