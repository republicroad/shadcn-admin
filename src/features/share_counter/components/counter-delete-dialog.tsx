import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type shareCounter } from '../data/schema'
import { deleteCounter } from '../../../api/serverApi'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { de } from '@faker-js/faker'
import { v } from 'node_modules/@faker-js/faker/dist/airline-DF6RqYmq'

type CounterDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: shareCounter
}

export function CountersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CounterDeleteDialogProps) {
  const queryClient = useQueryClient()

  async function handleDelete(){
      const res = await deleteCounter(currentRow.id, currentRow.user_id)
      toast.promise(sleep(0.01), {
        loading: 'delete counter...',
        success: () => {
          return  `delete counter ${currentRow.counter_name} success`
        },
        error: 'Error',
      })
      onOpenChange(false)
      return await res
    }
  
  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/counter'] })
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
          是否确认删除当前计数器：{' '}
            <span className='font-bold'>{currentRow.counter_name}</span>?
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
