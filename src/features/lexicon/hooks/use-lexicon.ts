import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { lexiconQueryKeys } from '../constants'
import {
  addLexiconData,
  createLexicon,
  deleteLexicon,
  deleteLexiconData,
  fetchLexiconData,
  fetchLexicons,
  testLexicon,
  type AddLexiconDataParams,
  type CreateLexiconParams,
  type DeleteLexiconDataParams,
  type DeleteLexiconParams,
  type FetchLexiconDataParams,
  type FetchLexiconsParams,
  type TestLexiconParams,
} from '../data/api'

export function useLexicons(params: FetchLexiconsParams) {
  return useQuery({
    queryKey: lexiconQueryKeys.list(params),
    queryFn: () => fetchLexicons(params),
  })
}

export function useLexiconData(params: FetchLexiconDataParams) {
  return useQuery({
    queryKey: lexiconQueryKeys.detail(params),
    enabled: Boolean(params.lexiconId),
    queryFn: () => fetchLexiconData(params),
  })
}

export function useCreateLexicon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateLexiconParams) => createLexicon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lexiconQueryKeys.all })
    },
  })
}

export function useDeleteLexicon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DeleteLexiconParams) => deleteLexicon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lexiconQueryKeys.all })
    },
  })
}

export function useAddLexiconData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddLexiconDataParams) => addLexiconData(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lexiconQueryKeys.all })
    },
  })
}

export function useDeleteLexiconData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DeleteLexiconDataParams) =>
      deleteLexiconData(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lexiconQueryKeys.all })
    },
  })
}

export function useTestLexicon() {
  return useMutation({
    mutationFn: (payload: TestLexiconParams) => testLexicon(payload),
  })
}
