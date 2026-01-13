import { Shield, LucideUserPen, UserCheck2, UserLock, UserPlus2} from 'lucide-react'
import { type UserStatus } from './schema'

export const callTypes = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const roles = [
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: Shield,
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: UserLock,
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: UserPlus2,
  },
  {
    label: 'Operator',
    value: 'operator',
    icon: LucideUserPen,
  },
  {
    label: 'Auditor',
    value: 'auditor',
    icon: UserCheck2,
  },
] as const

export const userStatus = [
  {
    label: 'Initializing',
    value: 'initializing',
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
  {
    label: 'Invited',
    value: 'invited',
  },
  {
    label: 'Suspended',
    value: 'suspended',
  },
] as const