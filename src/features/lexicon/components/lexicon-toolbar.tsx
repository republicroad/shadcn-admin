import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

type LexiconToolbarProps = {
  value: string
  placeholder: string
  className?: string
  onValueChange: (value: string) => void
}

export function LexiconToolbar({
  value,
  placeholder,
  className,
  onValueChange,
}: LexiconToolbarProps) {
  return (
    <div className={cn('relative max-w-sm flex-1', className)}>
      <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        className='h-8 pl-9'
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </div>
  )
}
