import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
// import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'
import { Input } from '@/components/ui/input'

// import { Textarea } from '@/components/ui/textarea'

const profileFormSchema = z.object({
  username: z
    .string('Please enter your username.')
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  password: z
      .string()
      .min(1, 'Please enter your password.')
      .min(7, 'Password must be at least 7 characters long.'),
  confirmPassword: z.string().min(1, 'Please confirm your password.'),
  }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
  })

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
// const defaultValues: Partial<ProfileFormValues> = {
//   password: '',
//   confirmPassword: '',
// }

export function PasswordProfileForm() {
  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    username: 'brde@geetest.com',  // axios.get('/api/user').then(res => res.data.username)
    password: '',
    confirmPassword: '',
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} disabled/>
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Update Password</Button>
      </form>
    </Form>
  )
}
