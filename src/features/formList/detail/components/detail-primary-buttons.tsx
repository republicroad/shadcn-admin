import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDetailList } from './detail-provider'

export function DetailListPrimaryButtons() {
  const { setOpen } = useDetailList()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create</span> <Plus size={18} />
      </Button>
    </div>
  )
}
