import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({}) => {
    // console.log('Current location:', location);
    // console.log('Current path:', location.pathname);
    // const user = useAuthStore.getState().user
    // console.log('_authenticated beforeLoad :', user)
    if (!useAuthStore.getState().isAuthenticated()) {
      // todo: 还要检测过期时间
      throw redirect({ to: '/sign-in' }) // Redirect to login if not authenticated
    }
  },
  component: AuthenticatedLayout,
})
