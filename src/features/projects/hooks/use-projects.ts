import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectsQueryKeys } from '../constants'
import {
  createProject,
  deleteProject,
  fetchProjects,
  type CreateProjectPayload,
  type DeleteProjectPayload,
  type FetchProjectsParams,
} from '../data/api'

export function useProjects(params: FetchProjectsParams) {
  return useQuery({
    queryKey: projectsQueryKeys.list(params),
    queryFn: () => fetchProjects(params),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.all })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DeleteProjectPayload) => deleteProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.all })
    },
  })
}
