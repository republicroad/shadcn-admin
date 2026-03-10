import { useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { type Message } from '../data/chat-types'

type MessageListProps = {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <Bot className='mx-auto h-12 w-12 text-muted-foreground' />
          <h3 className='mt-4 text-lg font-semibold'>Start a conversation</h3>
          <p className='mt-2 text-sm text-muted-foreground'>
            Send a message to begin chatting
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className='flex-1 px-4' ref={scrollRef}>
      <div className='mx-auto max-w-3xl space-y-6 py-6'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-4',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className='h-8 w-8 shrink-0'>
                <AvatarFallback className='bg-primary text-primary-foreground'>
                  <Bot className='h-4 w-4' />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <div className='whitespace-pre-wrap break-words text-sm'>
                {message.content}
              </div>
              <div
                className={cn(
                  'mt-1 text-xs',
                  message.role === 'user'
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                )}
              >
                {format(message.timestamp, 'HH:mm')}
              </div>
            </div>

            {message.role === 'user' && (
              <Avatar className='h-8 w-8 shrink-0'>
                <AvatarFallback className='bg-secondary'>
                  <User className='h-4 w-4' />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
