'use client'

import { Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const EmailInput = ({ ...props }: React.ComponentProps<'input'>) => (
  <div className='w-full max-w-sm space-y-2'>
    <Label htmlFor='email-input'>Email Address</Label>
    <div className='relative'>
      <Mail className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        {...props}
        className='bg-background pl-9'
        id='email-input'
        placeholder='you@example.com'
        type='email'
      />
    </div>
  </div>
)

export default EmailInput
