import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

// Use the import type syntax to explicitly tell TypeScript that this import
// is only for type checking and should be removed during compilation.
// Interfaces cannot be instantiated: JwtPayload is an interface, not a class.
// You cannot use it on the right side of an operator (e.g., new JwtPayload())
const secret = new TextEncoder().encode('fccdjny')

export async function signJwt(payload: object, ttl: string | number = '2h') {
  const accessToken = await new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(secret)
  return accessToken
}

export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, secret) // payload protectedHeader
  return payload
}
