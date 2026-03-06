import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { usePostsDialog } from './posts-provider'

export function PostsPrimaryButtons() {
  const { setOpen, setCurrentRow } = usePostsDialog()

  const handleCreate = () => {
    setCurrentRow(null)
    setOpen(true)
  }

  return (
    <div className='flex gap-2'>
      <Button onClick={handleCreate} size='sm' className='h-8'>
        <PlusIcon className='mr-2 size-4' aria-hidden='true' />
        New Post
      </Button>
    </div>
  )
}
