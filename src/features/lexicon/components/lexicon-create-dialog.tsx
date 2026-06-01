import * as React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type LexiconCreateDialogProps = {
  open: boolean
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (lexiconName: string) => Promise<void>
}

export function LexiconCreateDialog({
  open,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: LexiconCreateDialogProps) {
  const [name, setName] = React.useState('')

  const reset = () => setName('')

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting) return
        if (!nextOpen) reset()
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>创建词库</DialogTitle>
        </DialogHeader>
        <form
          id='lexicon-create-form'
          onSubmit={async (event) => {
            event.preventDefault()
            const value = name.trim()
            if (!value) {
              toast.error('请输入词库名称')
              return
            }
            await onSubmit(value)
            reset()
          }}
        >
          <div className='grid gap-2 py-2'>
            <Label htmlFor='lexicon-name'>
              <span className='text-destructive'>*</span>
              词库名称
            </Label>
            <Input
              id='lexicon-name'
              value={name}
              placeholder='请输入词库名称'
              autoComplete='off'
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            variant='outline'
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            type='submit'
            form='lexicon-create-form'
            disabled={isSubmitting}
          >
            {isSubmitting ? '创建中...' : '确定'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
