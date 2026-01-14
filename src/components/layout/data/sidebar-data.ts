import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
// import { type SidebarData } from '../types'

import { useTranslation } from 'react-i18next';

export function useSidebarData() {
  const { t } = useTranslation("sidebar");
  return {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: t('general'),
      items: [
        {
          title: t('dashboard'),
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: t('tasks'),
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: t('apps'),
          url: '/apps',
          icon: Package,
        },
        {
          title: t('chats'),
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: t('users'),
          url: '/users',
          icon: Users,
        },
        {
          title: t('secured by clerk'),
          icon: ClerkLogo,
          items: [
            {
              title: t('sign in'),
              url: '/clerk/sign-in',
            },
            {
              title: t('sign up'),
              url: '/clerk/sign-up',
            },
            {
              title: t('user management'),
              url: '/clerk/user-management',
            },
          ],
        },
      ],
    },
    {
      title: t('pages'),
      items: [
        {
          title: t('auth'),
          icon: ShieldCheck,
          items: [
            {
              title: t('sign in'),
              url: '/sign-in',
            },
            {
              title: t('sign in (2 col)'),
              url: '/sign-in-2',
            },
            {
              title: t('sign up'),
              url: '/sign-up',
            },
            {
              title: t('forgot password'),
              url: '/forgot-password',
            },
            {
              title: t('otp'),
              url: '/otp',
            },
          ],
        },
        {
          title: t('errors'),
          icon: Bug,
          items: [
            {
              title: t('unauthorized'),
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: t('forbidden'),
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: t('notFound'),
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: t('internalServerError'),
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: t('maintenanceError'),
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: t('other'),
      items: [
        {
          title: t('settings'),
          icon: Settings,
          items: [
            {
              title: t('profile'),
              url: '/settings',
              icon: UserCog,
            },
            {
              title: t('account'),
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: t('appearance'),
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: t('notifications'),
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: t('display'),
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: t('helpCenter'),
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
}