import { createFileRoute } from '@tanstack/react-router'
import { ResetPassword } from '@/features/auth/reset-password'

export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPassword,
})

// sign-in, sign-up, /forgot-password, /reset-password can all be accessed 
// without authentication, so they are placed under the "(auth)" group.
// function RouteComponent() {
//   return <div>Hello "/(auth)/reset-password"!</div>
// }
