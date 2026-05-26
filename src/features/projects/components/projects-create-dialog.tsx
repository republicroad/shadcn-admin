import * as React from 'react'
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

type ProjectsCreateDialogProps = {
  open: boolean
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { name: string }) => Promise<void> | void
}

export function ProjectsCreateDialog({
  open,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: ProjectsCreateDialogProps) {
  const [name, setName] = React.useState('')

  const resetForm = () => {
    setName('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit({ name: name.trim() })
    resetForm()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (isSubmitting) {
          return
        }
        if (!state) {
          resetForm()
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>创建场景</DialogTitle>
        </DialogHeader>

        <form id='project-create-form' onSubmit={handleSubmit}>
          <div className='grid gap-4 py-2'>
            <div className='grid gap-2'>
              <Label htmlFor='project-name'>
                <span className='text-destructive'>*</span>
                场景名称
              </Label>
              <Input
                id='project-name'
                placeholder='请输入场景名称'
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete='off'
                required
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
            form='project-create-form'
            disabled={isSubmitting}
          >
            {isSubmitting ? '创建中...' : '确定'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
