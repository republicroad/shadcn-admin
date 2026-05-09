import { createFileRoute } from '@tanstack/react-router'
import { SettingsPassword } from '@/features/settings/password'

export const Route = createFileRoute('/_authenticated/settings/password')({
  // component: RouteComponent,
  component: SettingsPassword,
})

// function RouteComponent() {
//   return <div>Hello "/_authenticated/settings/password"!</div>
// }
