import { useQuery } from '@tanstack/react-query'
import api from '@/shared/apiClient'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DetailListPrimaryButtons } from './components/detail-primary-buttons'
import { DetailListProvider } from './components/detail-provider'
import { DetailListTable } from './components/detail-table'
import { DetailListDialogs } from './components/detail-dialog'
import { detail_data }  from './data/data'

export default function DetailList() {
//   const { data } = useQuery({
//     queryKey: ['/api/tasks'],
//     queryFn: async () => {
//       const response = await api.post('/api/tasks')
//       const res = response.data
//       return res
//     },
//   })

  return (
    <DetailListProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>名单详情</h2>
            <p className='text-muted-foreground'>
             Manage  your formlist here!
            </p>
          </div>
          <DetailListPrimaryButtons />
        </div>
        <DetailListTable data={detail_data} />
      </Main>
      <DetailListDialogs listData={detail_data[0]} />
    </DetailListProvider>
  )
}
