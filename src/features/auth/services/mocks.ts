// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { authService, authEndpoint } from './auth'
import { fake_user_login, type LoginUser } from './utils'

// todo: 考虑如何比较优雅的开启和关闭 mock 某个接口的数据
export const handlers = [
  // mock数据, 类型和逻辑都可以封装到一个单独的模块里, 以保持 handlers.ts 的简洁和可维护性.
  http.post(authEndpoint.login, async ({ request }) => {
    const requestBody = (await request.json()) as LoginUser
    return HttpResponse.json(await fake_user_login(requestBody))
  }),
  http.post(authEndpoint.register, async ({ request }) => {
    // const requestBody = await request.json()
    return HttpResponse.json({
      status: 0,
      message: '注册成功！',
      data: {},
    })
  }),
  // // /forgot-password
  // http.all(authEndpoint.forgot, async ({ request }) => {
  //   return HttpResponse.json({})
  // }),
]
