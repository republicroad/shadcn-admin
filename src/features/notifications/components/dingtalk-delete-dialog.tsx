import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/apiClient'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Dingtalk } from '../data/schema'

type DingtalkDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Dingtalk | null
}

export function DingtalkDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: DingtalkDeleteDialogProps) {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (row: Dingtalk) => {
      const response = await api.delete(
        '/api/notifications/notify_dingtalk_info',
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
        queryKey: ['/api/notifications/notify_dingtalk_info'],
      })
      onOpenChange(false)
    },
    onError: handleServerError,
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='删除钉钉配置'
      destructive
      confirmText='确认删除'
      cancelBtnText='取消'
      handleConfirm={async () => {
        if (!currentRow) return

        await toast.promise(mutateAsync(currentRow), {
          loading: '正在删除钉钉配置...',
          success: '钉钉配置已删除',
          error: (error) =>
            error instanceof Error ? error.message : '钉钉配置删除失败',
        })
      }}
      desc={
        currentRow
          ? `将删除用户 ${currentRow.user_id} 下的钉钉配置。执行此操作不可撤销。`
          : '当前没有可删除的钉钉配置。'
      }
      disabled={!currentRow || isPending}
      isLoading={isPending}
    />
  )
}
