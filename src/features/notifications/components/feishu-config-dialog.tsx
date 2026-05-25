import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/apiClient'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Textarea } from '@/components/ui/textarea'
import { type Feishu } from '../data/schema'

const formSchema = z.object({
  user_id: z.string().trim().min(1, '请输入 user_id'),
  feishu_name: z
    .string()
    .trim()
    .min(1, '请输入名称')
    .max(50, '名称不能超过 50 个字符'),
  feishu_url: z
    .string()
    .trim()
    .min(1, '请输入飞书链接')
    .url('请输入正确的飞书链接'),
  key: z.string().trim().min(1, '请输入密钥'),
  tag: z.string().trim().max(200, '备注不能超过 200 个字符'),
})

type FeishuConfigForm = z.infer<typeof formSchema>

type FeishuConfigDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Feishu | null
  targetUserId?: string
}

function getDefaultValues(
  currentRow?: Feishu | null,
  targetUserId?: string
): FeishuConfigForm {
  return {
    user_id: currentRow?.user_id ?? targetUserId ?? '',
    feishu_name: currentRow?.feishu_name ?? '',
    feishu_url: currentRow?.feishu_url ?? '',
    key: currentRow?.key ?? '',
    tag: currentRow?.tag ?? '',
  }
}

export function FeishuConfigDialog({
  open,
  onOpenChange,
  currentRow,
  targetUserId,
}: FeishuConfigDialogProps) {
  const isEdit = !!currentRow
  const scopedUserId = currentRow?.user_id ?? targetUserId ?? ''
  const queryClient = useQueryClient()

  const form = useForm<FeishuConfigForm>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(currentRow, targetUserId),
  })

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(currentRow, targetUserId))
    }
  }, [currentRow, form, open, targetUserId])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: FeishuConfigForm) => {
      if (isEdit && currentRow) {
        const response = await api.put(
          '/api/notifications/notify_feishu_info',
          {
            user_id: values.user_id,
            feishu_name: values.feishu_name,
            feishu_url: values.feishu_url,
            key: values.key,
            tag: values.tag,
          },
          {
            params: {
              user_id: currentRow.user_id,
              id: currentRow.id,
            },
          }
        )
        return response.data
      }

      const response = await api.post('/api/notifications/notify_feishu_info', {
        user_id: values.user_id,
        feishu_name: values.feishu_name,
        feishu_url: values.feishu_url,
        key: values.key,
        tag: values.tag,
      })
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['/api/notifications/notify_feishu_info'],
      })
      form.reset(getDefaultValues(null, targetUserId))
      onOpenChange(false)
    },
    onError: handleServerError,
  })

  const onSubmit = async (values: FeishuConfigForm) => {
    await toast.promise(mutateAsync(values), {
      loading: isEdit ? '正在保存飞书配置...' : '正在创建飞书配置...',
      success: () => (isEdit ? '飞书配置已更新' : '飞书配置已创建'),
      error: (error) =>
        error instanceof Error ? error.message : '飞书配置提交失败',
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.reset(getDefaultValues(currentRow, targetUserId))
        }
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? '编辑飞书配置' : '新增飞书配置'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? '当前弹框已接入真实编辑接口，名称、飞书链接和密钥为必填项。'
              : '当前弹框已接入真实新增接口，`user_id`、名称、飞书链接和密钥为必填项。'}
          </DialogDescription>
        </DialogHeader>

        {isEdit ? (
          <div className='space-y-3 rounded-lg border bg-muted/20 p-4'>
            <div className='flex flex-wrap items-center gap-2 text-sm'>
              <span className='text-muted-foreground'>目标用户</span>
              <Badge variant='outline'>{scopedUserId}</Badge>
            </div>
            <p className='text-sm text-muted-foreground'>
              编辑时会沿用当前记录的 `user_id` 和
              `id`，并按接口约定提交更新请求。
            </p>
          </div>
        ) : null}

        <Form {...form}>
          <form
            id='feishu-config-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            {!isEdit ? (
              <FormField
                control={form.control}
                name='user_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户id</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='请输入用户 user_id'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <FormField
              control={form.control}
              name='feishu_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='例如：告警通知飞书'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='feishu_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>飞书链接</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='例如：https://example.com/feishu'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name='key'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密钥</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='请输入飞书密钥'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tag'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>备注</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='可填写用途、归属团队、特殊说明等'
                      className='min-h-24'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            取消
          </Button>
          <Button form='feishu-config-form' type='submit' disabled={isPending}>
            {isPending ? <Loader2 className='animate-spin' /> : null}
            {isEdit ? '保存修改' : '创建配置'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
