import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/apiClient'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Webhook } from '../data/schema'

type WebhookDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Webhook | null
}

export function WebhookDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: WebhookDeleteDialogProps) {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (row: Webhook) => {
      const response = await api.delete('/api/notifications/notify_webhook_info', {
        params: {
          user_id: row.user_id,
          id: row.id,
        },
      })
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['/api/notifications/notify_webhook_info'],
      })
      onOpenChange(false)
    },
    onError: handleServerError,
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='删除 Webhook 配置'
      destructive
      confirmText='确认删除'
      cancelBtnText='取消'
      handleConfirm={async () => {
        if (!currentRow) return

        await toast.promise(mutateAsync(currentRow), {
          loading: '正在删除 Webhook 配置...',
          success: 'Webhook 配置已删除',
          error: (error) =>
            error instanceof Error ? error.message : 'Webhook 配置删除失败',
        })
      }}
      desc={
        currentRow
          ? `将删除用户 ${currentRow.user_id} 下的 Webhook 配置。执行此操作不可撤销。`
          : '当前没有可删除的 Webhook 配置。'
      }
      disabled={!currentRow || isPending}
      isLoading={isPending}
    />
  )
}
