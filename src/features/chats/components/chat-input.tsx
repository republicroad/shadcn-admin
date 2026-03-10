import { useState, type FormEvent } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type ChatInputProps = {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className='border-t bg-background p-4'>
      <form onSubmit={handleSubmit} className='mx-auto max-w-3xl'>
        <div className='relative flex items-end gap-2'>
          <div className='relative flex-1'>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Send a message...'
              disabled={disabled}
              className='min-h-[60px] resize-none pr-12'
              rows={1}
            />
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='absolute bottom-2 right-2 h-8 w-8'
              disabled={disabled}
            >
              <Paperclip className='h-4 w-4' />
            </Button>
          </div>
          <Button
            type='submit'
            size='icon'
            disabled={!message.trim() || disabled}
            className='h-[60px] w-[60px] shrink-0'
          >
            <Send className='h-5 w-5' />
          </Button>
        </div>
        <p className='mt-2 text-center text-xs text-muted-foreground'>
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </div>
  )
}
