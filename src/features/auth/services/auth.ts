import authApi from '@/shared/authapiClient'
import { type credentials } from '../types/auth.types'

const authEndpoint = {
  register: '/api/auth/register',
  login: '/api/auth/login',
  forgot: '',
  emailOtp: '',
  reset: '/api/auth/reset-password',
  logout: '/api/auth/logout',
  getProfile: '/api/auth/me',
}

export const authService = {
  register: async (credentials: unknown) => {
    return authApi.post(authEndpoint.register, credentials)
  },
  login: async (credentials: unknown) => {
    return authApi.post(authEndpoint.login, credentials)
  },
  reset: async (credentials: credentials) => {
    return authApi.post(authEndpoint.reset, credentials)
  },
  // getProfile: () => authApi.get(getProfileUrl),
  // logout: () => authApi.post(logoutUrl),
}

interface authService2 {
  reset: {
    endpoint: string;
    (credentials: credentials): void
  }
}
