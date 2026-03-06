import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useDeptsDialog } from './depts-provider'

export function DeptsPrimaryButtons() {
  const { setOpen, setCurrentRow } = useDeptsDialog()

  const handleCreate = () => {
    setCurrentRow(null)
    setOpen(true)
  }

  return (
    <div className='flex gap-2'>
      <Button onClick={handleCreate} size='sm' className='h-8'>
        <PlusIcon className='mr-2 size-4' aria-hidden='true' />
        New Department
      </Button>
    </div>
  )
}
