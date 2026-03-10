import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
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
import { toast } from 'sonner'

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('auth')

  const formSchema = z
    .object({
      userName: z
        .string()
        .min(1, t('signUp.usernameRequired'))
        .min(3, t('signUp.usernameMinLength')),
      email: z.email({
        error: (iss) =>
          iss.input === '' ? t('signUp.emailRequired') : undefined,
      }),
      password: z
        .string()
        .min(1, t('signUp.passwordRequired'))
        .min(6, t('signUp.passwordMinLength')),
      confirmPassword: z.string().min(1, t('signUp.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('signUp.passwordsMismatch'),
      path: ['confirmPassword'],
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await authService.register({
        userName: data.userName,
        email: data.email,
        password: data.password,
      })

      toast.success(t('signUp.success'))

      setTimeout(() => {
        navigate({ to: '/sign-in' })
      }, 1000)
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || error.message || t('signUp.failed')
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
              <FormLabel>{t('signUp.username')}</FormLabel>
              <FormControl>
                <Input placeholder={t('signUp.usernamePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('signUp.email')}</FormLabel>
              <FormControl>
                <Input placeholder={t('signUp.emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('signUp.password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('signUp.confirmPassword')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? t('signUp.submitting') : t('signUp.submit')}
        </Button>
      </form>
    </Form>
  )
}
