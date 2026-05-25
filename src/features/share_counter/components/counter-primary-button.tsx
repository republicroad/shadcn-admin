import { FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCounter } from './counter-provider'

export function CounterPrimaryButtons() {
  const { setOpen } = useCounter()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>创建计数器</span> <FolderPlus size={18} />
      </Button>
    </div>
  )
}
