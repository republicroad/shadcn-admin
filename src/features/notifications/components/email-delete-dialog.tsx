import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/apiClient'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Email } from '../data/schema'

type EmailDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Email | null
}

export function EmailDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: EmailDeleteDialogProps) {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (row: Email) => {
      const response = await api.delete(
        '/api/notifications/notify_email_info',
        {
          params: {
            user_id: row.user_id,
            id: row.id,
          },
        }
      )
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['/api/notifications/notify_email_info'],
      })
      onOpenChange(false)
    },
    onError: handleServerError,
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='删除邮箱配置'
      destructive
      confirmText='确认删除'
      cancelBtnText='取消'
      handleConfirm={async () => {
        if (!currentRow) return

        await toast.promise(mutateAsync(currentRow), {
          loading: '正在删除邮箱配置...',
          success: '邮箱配置已删除',
          error: (error) =>
            error instanceof Error ? error.message : '邮箱配置删除失败',
        })
      }}
      desc={
        currentRow
          ? `将删除用户 ${currentRow.user_id} 下的邮箱 ${currentRow.email}。执行此操作不可撤销。`
          : '当前没有可删除的邮箱配置。'
      }
      disabled={!currentRow || isPending}
      isLoading={isPending}
    />
  )
}
