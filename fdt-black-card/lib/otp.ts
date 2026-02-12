import crypto from 'crypto'

const OTP_LENGTH = 6
const OTP_TTL_MINUTES = 10

export function generateOtpCode(): string {
  const max = 10 ** OTP_LENGTH
  const code = Math.floor(Math.random() * max).toString().padStart(OTP_LENGTH, '0')
  return code
}

export function getOtpExpiryDate(): Date {
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_TTL_MINUTES)
  return expiresAt
}

export function hashOtpCode(code: string, email: string): string {
  const secret = process.env.OTP_SECRET
  if (!secret) {
    throw new Error('OTP_SECRET is not set')
  }
  return crypto.createHash('sha256').update(`${secret}:${email}:${code}`).digest('hex')
}

export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const otpConfig = {
  length: OTP_LENGTH,
  ttlMinutes: OTP_TTL_MINUTES,
}
