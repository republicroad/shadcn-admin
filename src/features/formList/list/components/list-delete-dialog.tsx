import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type _List } from '../data/schema'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { deleteFormList } from "@/api/serverApi"


type ListDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: _List
}

export function ListDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ListDeleteDialogProps) {
  const queryClient = useQueryClient()

  async function handleDelete(){
      const res = await deleteFormList(currentRow.list_id)
      toast.promise(sleep(0.01), {
        loading: 'delete form list...',
        success: () => {
          return  `delete form list ${currentRow.list_name} success`
        },
        error: 'Error',
      })
      onOpenChange(false)
      return await res
    }
  
  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/formList/list'] })
    },
  })
  
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={mutation.mutate}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          删除
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
          是否确认删除当前名单：{' '}
            <span className='font-bold'>{currentRow.list_name}</span>?
          </p>
          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}