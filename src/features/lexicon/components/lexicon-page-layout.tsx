import { type ReactNode } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

type LexiconPageLayoutProps = {
  title: string
  description?: string
  children: ReactNode
}

export function LexiconPageLayout({
  title,
  description,
  children,
}: LexiconPageLayoutProps) {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            {description ? (
              <p className='text-muted-foreground'>{description}</p>
            ) : null}
          </div>
        </div>
        {children}
      </Main>
    </>
  )
}
