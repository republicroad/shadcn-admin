// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { signJwt } from '@/lib/jwt'
import authService from './auth'

export const handlers = [
  // /api/auth/login 以及相关的类型，mock数据和逻辑都可以封装到一个单独的模块里, 以保持 handlers.ts 的简洁和可维护性.
  http.post('/api/auth/login', async ({ request }) => {
    const requestBody = (await request.json()) as LoginUser
    return HttpResponse.json(await fake_user_login(requestBody))
  }),
  http.post('/api/auth/register', async ({ request }) => {
    // const requestBody = await request.json()
    return HttpResponse.json({
      status: 0,
      message: '注册成功！',
      data: {},
    })
  }),
  // /forgot-password
  // http.all('/api/auth/forgot-password', async ({ request }) => {
  //       // /api/forgot-password
  //       // const requestBody = await request.json();
  //       return HttpResponse.json(conversations);
  // }),
]

interface LoginUser {
  email: string
  password: string
  username: string
}

async function fake_user_login(requestBody: LoginUser) {
  const loginuser: LoginUser = requestBody
  const user = {
    username: loginuser.username,
    email: loginuser.email,
    user_id: '2344f9862db5422b8a155897626f72c4',
    exp: Date.now() / 1000,
  }
  // // todo: 把 jwt token生成和校验的逻辑放在一个单独的模块里, 以便在后端和前端都可以复用.
  // const secret = new TextEncoder().encode('fccdjny')
  // const accessToken = await new SignJWT(user)
  //   .setProtectedHeader({ alg: 'HS256' })
  //   .setIssuedAt()
  //   .setExpirationTime('2h')
  //   .sign(secret)
  const accessToken = await signJwt(user, '2h')
  return {
    status: 0,
    message: '登陆成功！',
    data: {
      accessToken: accessToken,
    },
  }
}
