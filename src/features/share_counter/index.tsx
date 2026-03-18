import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CounterDialogs } from './components/counter-dialogs'
import { CounterPrimaryButtons } from './components/counter-primary-button'
import { CounterProvider } from './components/counter-provider'
import { CounterTable } from './components/counter-table'
import { useQuery } from '@tanstack/react-query'
import { shareCounterListSchema } from './data/schema'
import { counter_list,counters } from './data/counter'

// import { users } from './data/users'

const route = getRouteApi('/_authenticated/counter/')

export function Counter() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data } = useQuery({  // data, isLoading, isError, error 
    queryKey: ['/api/counter'],
    queryFn: async () => {
      const response = await fetch('/api/counter');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = response.json();
      return res;
    },
  });
  // data is undefined initially because the query is still in the process of fetching data.
  
  // const counterList = shareCounterListSchema.parse(counter_list)
  // const counterList = shareCounterListSchema.parse(counters)
  const counterList =  data ?? [];

  return (
    <CounterProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>共享计数器列表</h2>
            <p className='text-muted-foreground'>
              Manage your share counter here.
            </p>
          </div>
          <CounterPrimaryButtons />
        </div>
        <CounterTable data={counterList} search={search} navigate={navigate} />
      </Main>

      < CounterDialogs />
    </CounterProvider>
  )
}
