import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import authApi from '@/shared/authapiClient'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth'
// import { useAuthStore } from '@/stores/auth-store'
import { sleep, cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
})

// const loginUser = async (credentials: any) => {
//   const response = await authApi.post('/api/auth/login', {
//     ...credentials,
//     username: credentials.email,
//   }) // Replace with your API endpoint
//   console.log('loginUser response:', response)
//   return response
// }

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function ForgotPasswordEmailForm({
  className,
  redirectTo,
  ...props
}: FormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  })

  const { mutateAsync } = useMutation({
    // isError, isSuccess, data, error
    // mutationFn: loginUser,
    //  (credentials as { email: string }).email
    mutationFn: async (credentials: Record<string, unknown>) => {
      console.log(credentials)
    },
    // authApi.post('/api/auth/login', credentials),
    onSuccess: async (response) => {
      console.log('mutationFn onSuccess:', response)
      // data 以后可以考虑用 typescript 类型来定义.
      await login(response.data.data.accessToken) // 直接调用 login 方法来设置 user 和 accessToken, 以及 expiresAt.
      // toast.success(data.message)
    },
    onError: (error) => {
      alert(`Login failed: ${error.message}`)
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    toast.promise(mutateAsync(data), {
      loading: 'Signing in...',
      success: () => {
        setIsLoading(false)
        return `Welcome back, ${data.email}!`
      },
      error: (err) => {
        setIsLoading(false)
        // Access custom error message from server response
        return err.response?.data?.message || err
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button> */}
      </form>
    </Form>
  )
}
