// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { signJwt } from '@/lib/jwt'
import { conversations } from '../features/chats/data/convo.json'
import { tasks } from '../features/tasks/data/tasks'
import { users } from '../features/users/data/users'

// import data1 from '../features/chats/data/convo.json' with { type: 'json' }

export const handlers = [
  // /api/auth/login 以及相关的类型，mock数据和逻辑都可以封装到一个单独的模块里, 以保持 handlers.ts 的简洁和可维护性.
  http.post('/api/auth/login', async ({ request }) => {
    const requestBody = await request.json()
    return HttpResponse.json(await fake_user_login(requestBody))
  }),
  http.post('/api/auth/register', async ({ request }) => {
    const requestBody = await request.json()
    return HttpResponse.json({
      status: 0,
      message: '注册成功！',
      data: {},
    })
  }),

  http.all('/api/users', async ({ request }) => {
    // const requestBody = await request.json();
    return HttpResponse.json({ status: 0, data: users })
  }),
  http.all('/api/tasks', async ({ request }) => {
    // const requestBody = await request.json();
    return HttpResponse.json(tasks)
  }),
  http.all('/api/chats', async ({ request }) => {
    // const requestBody = await request.json();
    return HttpResponse.json(conversations)
  }),
]

interface LoginUser {
  email: string
  password: string
  username: string
}

async function fake_user_login(requestBody: any) {
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

// async function fake_user_login_jwt(requestBody: any) {
//   const loginuser: LoginUser = requestBody
//   const user = {
//     username: loginuser.username,
//     email: loginuser.email,
//     user_id: '2344f9862db5422b8a155897626f72c4',
//     exp: Date.now() / 1000,
//   }
//   // 1. Convert object to JSON string
//   const jsonString = JSON.stringify(user)
//   // 2. Base64 encode the JSON string
//   const fakePayload = btoa(jsonString)
//   var accessToken =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndhbmdoYW9AZ2VldGVzdC5jb20iLCJ1c2VyX2lkIjoiMjM0NGY5ODYyZGI1NDIyYjhhMTU1ODk3NjI2ZjcyYzQiLCJleHAiOjE3NTU1MDMzNjh9.6zdp0451v8qqNZDsb28sXdU4Dwt3KJIVTRbOZQGHJSQ'
//   // jwt token 本质就是 {header}.{payload}.{signature} 的格式字符串.
//   // 其中 header 和 payload 都是 data object JSON.stringify() 之后在去 base64(btoa) 之后生成的字符串. 加上最后的签名用来校验是否被篡改.
//   const [header, _payload, signature] = accessToken.split('.') // 忽略掉原来的 payload, 因为payload中包含一个固定的过期时间, 此 payload 会被fake替换.
//   accessToken = [header, fakePayload, signature].join('.')

//   const login_res: object = {
//     status: 0,
//     message: '登陆成功！',
//     data: {
//       user: {
//         user_id: '2344f9862db5422b8a155897626f72c4',
//         user_key: '4c61f72fdca348b095b2a9c2eeb95a64',
//         username: user['username'],
//         permissions: [],
//       },
//       accessToken: accessToken,
//       expire_time: 1755239206,
//     },
//   }
//   return login_res
// }
