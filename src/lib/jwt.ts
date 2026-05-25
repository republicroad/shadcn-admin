import {
  SignJWT,
  // jwtVerify,
  decodeJwt as jose_decodeJwt,
  type JWTPayload,
} from 'jose'

// Use the import type syntax to explicitly tell TypeScript that this import
// is only for type checking and should be removed during compilation.
// Interfaces cannot be instantiated: JwtPayload is an interface, not a class.
// You cannot use it on the right side of an operator (e.g., new JwtPayload())

const secret = new TextEncoder().encode(
  '256 bit secret key for JWT signing and verification'
)
// 这个模块封装了 JWT 的生成、验证和解码逻辑, 以便在前端和后端都可以复用.
// 以后如果需要更换 JWT 库或者调整 JWT 的结构, 只需要修改这个模块即可, 不需要修改其他使用 JWT 的代码.

// 用于 mock login 时生成 JWT token, 以及在前端解析 JWT token 来获取用户信息和过期时间等.
export async function signJwt(payload: object, ttl: string | number = '2h') {
  const accessToken = await new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(secret)
  return accessToken
}

// // 用于在验证 JWT token 的有效性, 以及获取 JWT token 中的 payload.
// export async function verifyJwt(token: string) {
//   const { payload } = await jwtVerify(token, secret) // payload protectedHeader
//   return payload
// }

// 用于在前端解析 JWT token 来获取用户信息和过期时间等, 不进行签名验证,
// 适用于从 localStorage 或者 API 响应中解析 JWT token 的场景.
export function decodeJwt(token: string) {
  const payload = jose_decodeJwt(token) // payload protectedHeader
  return payload
}
