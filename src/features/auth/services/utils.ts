import { signJwt } from '@/lib/jwt'

export interface LoginUser {
  email: string
  password: string
  username: string
}

export async function fake_user_login(requestBody: LoginUser) {
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
