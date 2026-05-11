import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { getOtpDeliveryMode, sendOtpEmail } from './email'

type UserRecord = {
  email: string
  password: string
  role: string[]
}

const users = new Map<string, UserRecord>()
const resetOtps = new Map<string, string>()
const resetTokens = new Map<string, string>()
const host = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT || 8000)

const defaultUser: UserRecord = {
  email: 'demo@example.com',
  password: 'password123',
  role: ['admin'],
}

users.set(defaultUser.email, defaultUser)

function generateOtp(length = 6) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString('base64url')
}

function createDevJwt(email: string, role: string[], ttlSeconds = 2 * 60 * 60) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = base64UrlEncode(
    JSON.stringify({
      email,
      accountNo: email,
      role,
      exp: now + ttlSeconds,
      iat: now,
    })
  )
  const signature = base64UrlEncode(`dev-signature:${email}:${now}`)

  return `${header}.${payload}.${signature}`
}

function createResetToken(email: string) {
  const token = `reset-${base64UrlEncode(`${email}:${Date.now()}`)}`
  resetTokens.set(email, token)
  return token
}

export const app = new Elysia()
  .use(swagger())
  .get('/', () => ({
    status: 0,
    message: 'backend is running',
    data: {
      routes: [
        '/api/auth/register',
        '/api/auth/login',
        '/api/auth/email_otp',
        '/api/auth/verify_otp',
        '/api/auth/reset-password',
      ],
    },
  }))
  .post(
    '/api/auth/register',
    ({ body, set }) => {
      const { email, password, confirmPassword } = body

      if (password !== confirmPassword) {
        set.status = 400
        return {
          status: 1,
          message: "Passwords don't match.",
        }
      }

      if (users.has(email)) {
        set.status = 409
        return {
          status: 1,
          message: 'User already exists.',
        }
      }

      users.set(email, {
        email,
        password,
        role: ['user'],
      })

      return {
        status: 0,
        message: '注册成功！',
        data: {
          email,
        },
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 7 }),
        confirmPassword: t.String({ minLength: 7 }),
      }),
    }
  )
  .post(
    '/api/auth/login',
    ({ body, set }) => {
      const { email, password } = body
      const user = users.get(email)

      if (!user || user.password !== password) {
        set.status = 401
        return {
          status: 1,
          message: 'Invalid email or password.',
        }
      }

      return {
        status: 0,
        message: '登陆成功！',
        data: {
          accessToken: createDevJwt(user.email, user.role),
        },
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 7 }),
      }),
    }
  )
  .post(
    '/api/auth/email_otp',
    async ({ body, set }) => {
      const { email } = body

      if (!users.has(email)) {
        set.status = 404
        return {
          status: 1,
          message: 'User not found.',
        }
      }

      const otp = generateOtp()
      resetOtps.set(email, otp)

      try {
        const result = await sendOtpEmail({ otp, to: email })

        return {
          status: 0,
          message:
            result.mode === 'smtp'
              ? 'OTP email sent successfully.'
              : 'OTP generated. SMTP is not configured yet, check backend logs.',
          data: {
            deliveryMode: result.mode,
          },
        }
      } catch (error) {
        console.error('Failed to send OTP email:', error)
        set.status = 500
        return {
          status: 1,
          message: 'Failed to send OTP email.',
        }
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
    }
  )
  .post(
    '/api/auth/verify_otp',
    ({ body, set }) => {
      const { email, otp } = body
      const expectedOtp = resetOtps.get(email)

      if (!expectedOtp || expectedOtp !== otp) {
        set.status = 400
        return {
          status: 1,
          message: 'Invalid OTP.',
        }
      }

      resetOtps.delete(email)
      const token = createResetToken(email)

      return {
        status: 0,
        message: 'OTP verified successfully!',
        token,
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        otp: t.String({ minLength: 6, maxLength: 6 }),
      }),
    }
  )
  .post(
    '/api/auth/reset-password',
    ({ body, set }) => {
      const { email, password, confirmPassword, token } = body
      const user = users.get(email)
      const expectedToken = resetTokens.get(email)

      if (!user) {
        set.status = 404
        return {
          status: 1,
          message: 'User not found.',
        }
      }

      if (password !== confirmPassword) {
        set.status = 400
        return {
          status: 1,
          message: "Passwords don't match.",
        }
      }

      if (!token || token !== expectedToken) {
        set.status = 400
        return {
          status: 1,
          message: 'Invalid reset token.',
        }
      }

      users.set(email, {
        ...user,
        password,
      })
      resetTokens.delete(email)

      return {
        status: 0,
        message: 'Password reset successfully.',
        data: {},
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 7 }),
        confirmPassword: t.String({ minLength: 7 }),
        token: t.String(),
      }),
    }
  )
  .get('/api/users/me', ({ headers, set }) => {
    const authorization = headers.authorization ?? ''
    if (!authorization.startsWith('Bearer ')) {
      set.status = 401
      return {
        status: 1,
        message: 'Missing bearer token.',
      }
    }

    const token = authorization.slice('Bearer '.length)
    const [, payloadSegment] = token.split('.')

    if (!payloadSegment) {
      set.status = 401
      return {
        status: 1,
        message: 'Invalid token.',
      }
    }

    const payload = JSON.parse(Buffer.from(payloadSegment, 'base64url').toString())

    return {
      status: 0,
      data: {
        user: payload,
      },
    }
  })
if (process.env.NO_LISTEN !== 'true') {
  app.listen({
    hostname: host,
    port,
  })

  console.log(`Bun.version:${Bun.version}`)
  console.log(
    `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
  )
  console.log(
    `OpenAPI is running at http://${app.server?.hostname}:${app.server?.port}/swagger`
  )
  console.log(`OTP delivery mode: ${getOtpDeliveryMode()}`)
}
