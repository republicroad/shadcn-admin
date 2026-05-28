import { decodeJwt } from '@/lib/jwt'

type PersistedAuthUser = {
  user_id?: string
  userId?: string
  id?: string
  user_key?: string
  userKey?: string
  userkey?: string
  key?: string
  app_key?: string
  username?: string
  [key: string]: unknown
}

type PersistedAuthStore = {
  state?: {
    accessToken?: string
    user?: PersistedAuthUser | null
  }
}

const AUTH_STORAGE_KEY = 'brdeAuth'
const EMPTY_AUTH = { accessToken: '', user: null as PersistedAuthUser | null }
const USER_ID_FIELDS = ['user_id', 'userId', 'id'] as const
const USER_KEY_FIELDS = ['user_key', 'userKey', 'userkey', 'app_key', 'key'] as const

function parsePersistedAuthStore(raw: string | null) {
  try {
    return raw ? (JSON.parse(raw) as PersistedAuthStore) : null
  } catch {
    return null
  }
}

export function getPersistedRulesAuth() {
  if (typeof window === 'undefined') return EMPTY_AUTH

  const persisted = parsePersistedAuthStore(
    window.localStorage.getItem(AUTH_STORAGE_KEY)
  )

  return {
    accessToken: persisted?.state?.accessToken || '',
    user: persisted?.state?.user ?? null,
  }
}

export function normalizeRulesToken(token: unknown) {
  if (typeof token !== 'string') return ''

  const trimmedToken = token.trim()
  return trimmedToken.startsWith('Bearer ')
    ? trimmedToken.slice('Bearer '.length).trim()
    : trimmedToken
}

function getFirstNonEmpty(...values: Array<string | undefined>) {
  return values.find((value) => typeof value === 'string' && value.trim()) || ''
}

function getFieldFromRecord(
  record: Record<string, unknown>,
  fieldNames: readonly string[]
) {
  return getFirstNonEmpty(
    ...fieldNames.map((fieldName) => {
      const value = record[fieldName]
      return typeof value === 'string' ? value.trim() : undefined
    })
  )
}

function getJwtField(token: string, fieldNames: readonly string[]) {
  if (!token) return ''

  try {
    return getFieldFromRecord(
      decodeJwt(token) as Record<string, unknown>,
      fieldNames
    )
  } catch {
    return ''
  }
}

function getUserField(
  user?: PersistedAuthUser | null,
  token?: string,
  fieldNames: readonly string[] = []
) {
  return getFirstNonEmpty(
    user ? getFieldFromRecord(user, fieldNames) : '',
    getJwtField(normalizeRulesToken(token), fieldNames)
  )
}

export function getRulesAuthUserId(user?: PersistedAuthUser | null, token?: string) {
  return getUserField(user, token, USER_ID_FIELDS)
}

export function getRulesAuthUserKey(
  user?: PersistedAuthUser | null,
  token?: string
) {
  return getUserField(user, token, USER_KEY_FIELDS)
}
