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

type LexiconDataAddDialogProps = {
  open: boolean
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { value: string; tag: string }) => Promise<void>
}

export function LexiconDataAddDialog({
  open,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: LexiconDataAddDialogProps) {
  const [value, setValue] = React.useState('')
  const [tag, setTag] = React.useState('')

  const reset = () => {
    setValue('')
    setTag('')
  }

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
          <DialogTitle>添加词语</DialogTitle>
        </DialogHeader>
        <form
          id='lexicon-data-add-form'
          onSubmit={async (event) => {
            event.preventDefault()
            const nextValue = value.trim()
            if (!nextValue) {
              toast.error('请输入词语')
              return
            }
            await onSubmit({ value: nextValue, tag: tag.trim() })
            reset()
          }}
        >
          <div className='grid gap-4 py-2'>
            <div className='grid gap-2'>
              <Label htmlFor='lexicon-data-value'>
                <span className='text-destructive'>*</span>
                词语
              </Label>
              <Input
                id='lexicon-data-value'
                value={value}
                placeholder='请输入词语'
                onChange={(event) => setValue(event.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='lexicon-data-tag'>标签</Label>
              <Input
                id='lexicon-data-tag'
                value={tag}
                placeholder='请输入标签'
                onChange={(event) => setTag(event.target.value)}
              />
            </div>
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
            form='lexicon-data-add-form'
            disabled={isSubmitting}
          >
            {isSubmitting ? '添加中...' : '确定'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
