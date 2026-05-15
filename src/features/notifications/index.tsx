import { getRouteApi } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
// import { NotificationsDialogs } from './components/notifications-dialogs'
// import { NotificationsPrimaryButtons } from './components/notifications-primary-buttons'
import { DingtalkNotificationsPanel } from './components/dingtalk-notifications-panel'
import { EmailNotificationsPanel } from './components/email-notifications-panel'
import { FeishuNotificationsPanel } from './components/feishu-notifications-panel'
import { NotificationsProvider } from './components/notifications-provider'
import { WebhookNotificationsPanel } from './components/webhook-notifications-panel'
import { notificationChannels } from './data/channels'

const route = getRouteApi('/_authenticated/notifications/')

export function Notifications() {
  const { channel = 'email' } = route.useSearch()
  const navigate = route.useNavigate()
  const currentChannel =
    notificationChannels.find((item) => item.value === channel) ??
    notificationChannels[0]

  return (
    <NotificationsProvider>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      {/* ===== Main ===== */}
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>通知管理</h2>
            <p className='text-muted-foreground'>
              通知功能配置管理，当前正在配置“{currentChannel.label}
              ”。
            </p>
          </div>
        </div>

        <Tabs
          value={channel}
          onValueChange={(value) =>
            navigate({
              search: (prev) => ({
                ...prev,
                channel: value as 'email' | 'feishu' | 'dingtalk' | 'webhook',
              }),
            })
          }
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              {notificationChannels.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {/* ===== 邮箱 ===== */}
          <TabsContent value='email' className='space-y-4'>
            <EmailNotificationsPanel />
          </TabsContent>
          {/* ===== 飞书 ===== */}
          <TabsContent value='feishu' className='space-y-4'>
            <FeishuNotificationsPanel />
          </TabsContent>
          {/* ===== 钉钉 ===== */}
          <TabsContent value='dingtalk' className='space-y-4'>
            <DingtalkNotificationsPanel />
          </TabsContent>
          {/* ===== Webhook ===== */}
          <TabsContent value='webhook' className='space-y-4'>
            <WebhookNotificationsPanel />
          </TabsContent>
        </Tabs>
      </Main>

      {/* <UsersDialogs /> */}
    </NotificationsProvider>
  )
}
