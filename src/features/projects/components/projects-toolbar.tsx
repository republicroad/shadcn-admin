import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type ProjectsToolbarProps = {
  searchTerm: string
  onSearchTermChange: (value: string) => void
}

export function ProjectsToolbar({
  searchTerm,
  onSearchTermChange,
}: ProjectsToolbarProps) {
  return (
    <div className='flex items-center gap-2'>
      <div className='relative max-w-sm flex-1'>
        <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder='请输入场景名称进行搜索'
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          className='h-8 pl-9'
        />
      </div>
    </div>
  )
}
