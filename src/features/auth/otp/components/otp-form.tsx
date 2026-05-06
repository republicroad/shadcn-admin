import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import api from '@/shared/apiClient'
import { toast } from 'sonner'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

const formSchema = z.object({
  otp: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

type OtpFormProps = React.HTMLAttributes<HTMLFormElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const otp = form.watch('otp')

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const email = localStorage.getItem('forgotPassword.email')
    const data_with_email = { email: email, ...data }
    console.log('OtpForm submitted data:', data_with_email)
    toast.promise(api.post('/api/auth/verify_otp', data_with_email), {
      loading: 'Verifying OTP...',
      success: (response) => {
        console.log('OTP verification successful, server response:', response)
        if (response.data.status == 0) {
          const token = response.data.token // Assuming the token is in the response data
          console.log('OTP verification successful, received token:', token)
          localStorage.setItem('forgotPassword.token', token)
          localStorage.removeItem('forgotPassword.email')
          setIsLoading(false)
          navigate({ to: '/reset-password' })
        } else {
          setIsLoading(false)
        }
        return response.data.message || 'OTP verified successfully!'
      },
      error: (err) => {
        console.log('OTP verification failed:', err)
        setIsLoading(false)
        // Access custom error message from server response
        return err.response?.data?.message || err
        // throw new Error(err.response?.data?.message || err) // 这里抛出一个错误来触发 toast 的 error 状态, 因为 OTP 验证失败后我们还需要做一些其他的操作, 比如保持在当前页面和显示 toast.
      },
    })
    // showSubmittedData(data)
    // setTimeout(() => {
    //   setIsLoading(false)
    //   navigate({ to: '/reset-password' })
    // }, 1000)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={otp.length < 6 || isLoading}>
          Verify
        </Button>
      </form>
    </Form>
  )
}
