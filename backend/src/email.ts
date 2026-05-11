type SendOtpEmailParams = {
  otp: string
  to: string
}

type EmailDeliveryResult = {
  mode: 'log' | 'smtp'
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM
  const secure = process.env.SMTP_SECURE === 'true'

  const configured = Boolean(host && user && pass && from)

  return {
    configured,
    from,
    host,
    pass,
    port,
    secure,
    user,
  }
}

export function getOtpDeliveryMode() {
  return getSmtpConfig().configured ? 'smtp' : 'log'
}

export async function sendOtpEmail({
  otp,
  to,
}: SendOtpEmailParams): Promise<EmailDeliveryResult> {
  const smtp = getSmtpConfig()

  if (!smtp.configured) {
    console.log(`[otp] ${to}: ${otp}`)
    return { mode: 'log' }
  }

  const nodemailerModule = await import('nodemailer')
  const nodemailer = nodemailerModule.default ?? nodemailerModule

  const transporter = nodemailer.createTransport({
    auth: {
      pass: smtp.pass,
      user: smtp.user,
    },
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
  })

  await transporter.sendMail({
    from: smtp.from,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset OTP</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `,
    subject: process.env.OTP_EMAIL_SUBJECT || 'Your OTP Code',
    text: `Your verification code is: ${otp}`,
    to,
  })

  return { mode: 'smtp' }
}
