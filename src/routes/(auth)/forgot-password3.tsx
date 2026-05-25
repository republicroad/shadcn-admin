import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword3 } from '@/features/auth/forgot-password3'

export const Route = createFileRoute('/(auth)/forgot-password3')({
  component: ForgotPassword3,
})
