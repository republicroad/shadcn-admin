import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { verifyJwt } from '@/lib/jwt'

export interface User {
  id?: string
  accountNo?: string
  email: string
  phone?: string
  role?: string[]
  exp: number
  ttl?: number
}

interface AuthState {
  user: null | User
  setUser: (user: User) => void
  accessToken: string
  expiresAt: number
  setAccessToken: (accessToken: string) => void
  resetAccessToken: () => void
  reset: () => void
  isAuthenticated: () => boolean
  login: (accessToken: string) => void
  // logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      return {
        user: null,
        setUser: (user) => {
          set({ user })
        },
        accessToken: '',
        expiresAt: 0,
        setAccessToken: (accessToken) => {
          set({ accessToken })
        },
        resetAccessToken: () => {
          set({ accessToken: '' })
        },
        reset: () => {
          set({ user: null, accessToken: '', expiresAt: 0 })
        }, //{ user: null, accessToken: '' }
        isAuthenticated: () => {
          const result =
            get().expiresAt > Date.now() / 1000 &&
            get().user !== null &&
            get().accessToken !== ''
          // console.log('get().expiresAt:', get().expiresAt)
          // console.log('Date.now() / 1000:', Date.now() / 1000)
          return result
        }, // 以后可以根据 user 和 accessToken 来判断是否 authenticated.
        login: async (accessToken: string) => {
          // const { payload: user } = await verifyJwt(accessToken)
          const payload = await verifyJwt(accessToken)
          const user: User = payload as unknown as User
          const expiresAt = user.exp
          set({ user, accessToken, expiresAt })
        },
        // logout: () => {
        //   set({ user: null, accessToken: '', expiresAt: 0 })
        // },
      }
    },
    { name: 'brdeAuth' }
  )
)

// function getOwnMethods(obj: object): string[] {
//   return Object.getOwnPropertyNames(obj).filter(
//     (prop) => typeof obj[prop as keyof typeof obj] === 'function'
//   );
// }

// if (import.meta.env.DEV)
// {
// console.log("useBrdeAuthStore:")
// console.log(useAuthStore)
// console.log("useBrdeAuthStore.getState():")
// console.log(useAuthStore.getState())
// // console.log(Object.getOwnPropertyNames(useAuthStore.getState().auth))
// console.log("useBrdeAuthStore functions:", getOwnMethods(useAuthStore.getState()))
// }
