import { createFileRoute, redirect, useLocation } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { isAuthenticated } from '@/lib/auth'; // A function to check auth status

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    // console.log('Current location:', location);
    // console.log('Current path:', location.pathname);
    if (!isAuthenticated()) {
      throw redirect({ to: '/sign-in' }); // Redirect to login if not authenticated
    }
  },
  component: AuthenticatedLayout,
})
