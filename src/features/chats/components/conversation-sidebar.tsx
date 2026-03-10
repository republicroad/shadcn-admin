import { useState } from 'react'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type Conversation } from '../data/chat-types'

type ConversationSidebarProps = {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete?: (id: string) => void
}

export function ConversationSidebar({
  conversations,
  selectedId,
  onSelect,
  onNew,
  onDelete,
}: ConversationSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className='flex h-full w-64 flex-col rounded-lg border bg-card'>
      {/* Header */}
      <div className='flex items-center justify-between border-b p-4'>
        <h2 className='text-lg font-semibold'>Chats</h2>
        <Button size='icon' variant='ghost' onClick={onNew}>
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* Conversation List */}
      <ScrollArea className='flex-1'>
        <div className='space-y-1 p-2'>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                'group relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted',
                selectedId === conv.id && 'bg-muted'
              )}
              onClick={() => onSelect(conv.id)}
              onMouseEnter={() => setHoveredId(conv.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <MessageSquare className='h-4 w-4 shrink-0 text-muted-foreground' />
              <span className='flex-1 truncate'>{conv.title}</span>

              {hoveredId === conv.id && onDelete && (
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-6 w-6 opacity-0 group-hover:opacity-100'
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(conv.id)
                  }}
                >
                  <Trash2 className='h-3 w-3' />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
