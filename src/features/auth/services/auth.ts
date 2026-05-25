import authApi from '@/shared/authapiClient'
import { type credentials } from '../types/auth.types'

export const authEndpoint = {
  register: '/api/auth/register',
  login: '/api/auth/login',
  resetPassword: '/api/auth/reset-password',
  forgotResetPasswdWithOTPv2:
    '/api/auth/forgot-password/reset-password-with-otp',
  forgotPasswdEmailv2: '/api/auth/forgot-password/email-otp',
  // // logout getProfile 接口需要取得授权后才能访问
  // logout: '/api/auth/logout',
  // getProfile: '/api/auth/me',
  forgotv1: '/api/auth/email_otp',
  emailOtpv1: '/api/auth/email_otp',
}

// UI 组件中应该只有数据, 不应该包含 http response 相关的结构.
export const authService = {
  register: async (credentials: unknown) => {
    return (await authApi.post(authEndpoint.register, credentials)).data
  },
  login: async (credentials: unknown) => {
    // {...credentials, username: credentials.email}
    return (await authApi.post(authEndpoint.login, credentials)).data
  },
  resetPassword: async (credentials: credentials) => {
    return (await authApi.post(authEndpoint.resetPassword, credentials)).data
  },
  // getProfile: () => authApi.get(getProfileUrl),
  // logout: () => authApi.post(logoutUrl),
  forgotResetPasswdWithOTPv2: async (credentials: credentials) => {
    return (
      await authApi.post(authEndpoint.forgotResetPasswdWithOTPv2, credentials)
    ).data
  },
  forgotPasswdEmailv2: async (credentials: credentials) => {
    return (await authApi.post(authEndpoint.forgotPasswdEmailv2, credentials))
      .data
  },
}
