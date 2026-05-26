export const PROJECTS_PAGE_SIZE = 10
export const PROJECTS_COPY_FEEDBACK_DURATION = 2000

export const PROJECT_USER_ID =
  import.meta.env.VITE_PROJECT_USER_ID ?? 'c2f794e415924602ba8d89ceb8059ef6'

export const projectsQueryKeys = {
  all: ['projects'] as const,
  list: (params: unknown) =>
    [...projectsQueryKeys.all, 'list', params] as const,
}
