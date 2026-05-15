import { useQuery } from '@tanstack/react-query'
import api from '@/shared/apiClient'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ListPrimaryButtons } from './components/list-primary-buttons'
import { ListProvider } from './components/list-provider'
import { ListTable } from './components/list-table'
import { ListDialogs } from './components/list-dialog'
import { list_data }  from './data/data'
import { fetchFormList } from "@/api/serverApi"

export default function List() {
  const { data } = useQuery({
    queryKey: ['/formList/list'],
    queryFn: async () => {
      const response = await fetchFormList();
      return response
    },
  });
  const data_list =  data? data.data: list_data;
  return (
    <ListProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>名单列表</h2>
            <p className='text-muted-foreground'>
             Manage  your formlist here!
            </p>
          </div>
          <ListPrimaryButtons />
        </div>
        <ListTable data={data_list} />
      </Main>
      <ListDialogs/>
    </ListProvider>
  )
}
