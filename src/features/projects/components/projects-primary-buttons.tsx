import { FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ProjectsPrimaryButtonsProps = {
  onCreateClick: () => void
}

export function ProjectsPrimaryButtons({
  onCreateClick,
}: ProjectsPrimaryButtonsProps) {
  return (
    <Button className='space-x-1' onClick={onCreateClick}>
      <span>创建场景</span>
      <FolderPlus size={18} />
    </Button>
  )
}
