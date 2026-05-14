import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordOTP } from '@/features/auth/forgot-password2'

export const Route = createFileRoute('/(auth)/forgot-password2')({
  component: ForgotPasswordOTP,
})
