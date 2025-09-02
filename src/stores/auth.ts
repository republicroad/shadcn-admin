import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id?: string
  accountNo: string
  email: string
  phone?: string
  role: string[]
  exp: number
}

interface AuthState {
  user: null | User
  setUser: (user: User) => void;
  accessToken: string
  setAccessToken: (accessToken: string) => void
  resetAccessToken: () => void
  reset:  () => void;
}

export const useAuthStore = create<AuthState>()(
  persist((set) => 
    {
      const token = '';
      return {
        user: null,
        setUser: (user) => { set({ user }) },
        accessToken: token,
        setAccessToken: (accessToken) => { set({ accessToken }) },
        resetAccessToken: () => { set({ accessToken: '' }) },
        reset: () => { set( { user: null, accessToken: '' } ) },  //{ user: null, accessToken: '' }
      }
    },
    {name: 'brdeAuth'}
  )
);

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
