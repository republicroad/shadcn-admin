import * as React from 'react'
import { toast } from 'sonner'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProjectsCreateDialog } from './components/projects-create-dialog'
import { ProjectsListTable } from './components/projects-list-table'
import { ProjectsPagination } from './components/projects-pagination'
import { ProjectsPrimaryButtons } from './components/projects-primary-buttons'
import { ProjectsProvider } from './components/projects-provider'
import { ProjectsToolbar } from './components/projects-toolbar'
import {
  PROJECTS_COPY_FEEDBACK_DURATION,
  PROJECTS_PAGE_SIZE,
  PROJECT_USER_ID,
} from './constants'
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
} from './hooks/use-projects'

export function Projects() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [copiedProjectId, setCopiedProjectId] = React.useState<string | null>(
    null
  )

  const { data, isError, isLoading } = useProjects({
    userId: PROJECT_USER_ID,
    current: currentPage,
    pageSize: PROJECTS_PAGE_SIZE,
    search: searchTerm,
  })
  const createProjectMutation = useCreateProject()
  const deleteProjectMutation = useDeleteProject()

  const projects = data?.projects ?? []
  const totalPages = Math.ceil(
    (data?.pagination.total ?? 0) / PROJECTS_PAGE_SIZE
  )
  const deletingProjectId = deleteProjectMutation.isPending
    ? (deleteProjectMutation.variables?.projectId ?? null)
    : null

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  React.useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  React.useEffect(() => {
    if (!copiedProjectId) {
      return
    }

    const timer = window.setTimeout(() => {
      setCopiedProjectId(null)
    }, PROJECTS_COPY_FEEDBACK_DURATION)

    return () => window.clearTimeout(timer)
  }, [copiedProjectId])

  const handleCopyProjectId = React.useCallback(async (projectId: string) => {
    try {
      await navigator.clipboard.writeText(projectId)
      setCopiedProjectId(projectId)
    } catch {
      toast.error('复制场景编号失败')
    }
  }, [])

  const handleCreateProject = React.useCallback(
    async ({ name }: { name: string }) => {
      if (!name) {
        toast.error('请输入场景名称')
        return
      }

      await createProjectMutation.mutateAsync({
        userId: PROJECT_USER_ID,
        name,
      })
      setIsCreateDialogOpen(false)
      toast.success('场景创建成功')
    },
    [createProjectMutation]
  )

  const handleDeleteProject = React.useCallback(
    async (projectId: string) => {
      await deleteProjectMutation.mutateAsync({
        userId: PROJECT_USER_ID,
        projectId,
      })
      toast.success('场景删除成功')
    },
    [deleteProjectMutation]
  )

  return (
    <ProjectsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>场景列表</h2>
            <p className='text-muted-foreground'>
              管理场景、场景编号和对应的规则数量。
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-3'>
          <ProjectsToolbar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
          <ProjectsPrimaryButtons
            onCreateClick={() => setIsCreateDialogOpen(true)}
          />
        </div>

        <ProjectsListTable
          projects={projects}
          copiedProjectId={copiedProjectId}
          deletingProjectId={deletingProjectId}
          isError={isError}
          isLoading={isLoading}
          onCopyProjectId={handleCopyProjectId}
          onDeleteProject={handleDeleteProject}
        />

        <ProjectsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Main>

      <ProjectsCreateDialog
        open={isCreateDialogOpen}
        isSubmitting={createProjectMutation.isPending}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateProject}
      />
    </ProjectsProvider>
  )
}
