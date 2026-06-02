export const LEXICON_PAGE_SIZE = 10

export const LEXICON_USER_ID =
  import.meta.env.VITE_LEXICON_USER_ID ?? 'c2f794e415924602ba8d89ceb8059ef6'

export const lexiconQueryKeys = {
  all: ['lexicon'] as const,
  list: (params: unknown) => [...lexiconQueryKeys.all, 'list', params] as const,
  detail: (params: unknown) =>
    [...lexiconQueryKeys.all, 'detail', params] as const,
}
