import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
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
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { authService } from '@/services'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { t } = useTranslation('auth')

  const formSchema = z.object({
    userName: z.string().min(1, t('signIn.usernameRequired')),
    password: z
      .string()
      .min(1, t('signIn.passwordRequired'))
      .min(6, t('signIn.passwordMinLength')),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await authService.login({
        userName: data.userName,
        password: data.password,
      })

      localStorage.setItem('token', response.token)

      auth.setUser({
        accountNo: String(response.user.userId),
        email: response.user.email,
        role: [],
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
      auth.setAccessToken(response.token)

      toast.success(t('signIn.welcomeBack', { name: response.user.nickName || data.userName }))

      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || error.message || t('signIn.failed')
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
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
          name='userName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('signIn.username')}</FormLabel>
              <FormControl>
                <Input placeholder={t('signIn.usernamePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>{t('signIn.password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute end-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                {t('signIn.forgotPassword')}
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          {t('signIn.submit')}
        </Button>
      </form>
    </Form>
  )
}
