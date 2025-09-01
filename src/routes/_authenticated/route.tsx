import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({}) => {
    // console.log('Current location:', location);
    // console.log('Current path:', location.pathname);
    const user = useAuthStore.getState().auth.user;
    console.log("_authenticated beforeLoad:", useAuthStore.getState().auth.user);
    if (!user) {  // todo: 还要检测过期时间
      throw redirect({ to: '/sign-in' }); // Redirect to login if not authenticated
    }
  },
  component: AuthenticatedLayout,
})
