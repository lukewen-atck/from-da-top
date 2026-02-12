import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import prisma from '@/lib/prisma'
import { generateOtpCode, getOtpExpiryDate, hashOtpCode, isEmailValid, otpConfig } from '@/lib/otp'

type RequestBody = {
  email?: string
}

const defaultOrigin = 'https://from-da-echo.vercel.app'

function getCorsHeaders(request: Request) {
  const origin = request.headers.get('origin') || ''
  const allowList = (process.env.CORS_ORIGIN || defaultOrigin)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  const isAllowed = allowList.includes(origin)
  const allowOrigin = isAllowed ? origin : allowList[0] || defaultOrigin

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) })
}

export async function POST(request: Request) {
  const { email } = (await request.json()) as RequestBody

  if (!email || !isEmailValid(email)) {
    return NextResponse.json(
      { error: 'Invalid email' },
      { status: 400, headers: getCorsHeaders(request) }
    )
  }

  const fromEmail = process.env.SENDGRID_FROM_EMAIL
  const fromName = process.env.SENDGRID_FROM_NAME || 'FROM DA ECHO'
  const apiKey = process.env.SENDGRID_API_KEY

  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 500, headers: getCorsHeaders(request) }
    )
  }

  const now = new Date()
  const recentCode = await prisma.echoOtpCode.findFirst({
    where: {
      email,
      createdAt: { gte: new Date(now.getTime() - 60 * 1000) },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (recentCode) {
    return NextResponse.json(
      { error: 'Please wait before requesting another code' },
      { status: 429, headers: getCorsHeaders(request) }
    )
  }

  const code = generateOtpCode()
  const codeHash = hashOtpCode(code, email)
  const expiresAt = getOtpExpiryDate()

  await prisma.echoOtpCode.create({
    data: {
      email,
      codeHash,
      expiresAt,
    },
  })

  sgMail.setApiKey(apiKey)

  await sgMail.send({
    to: email,
    from: { email: fromEmail, name: fromName },
    subject: 'FROM DA ECHO CHALLENGE 驗證碼',
    text: `你的驗證碼是 ${code}，有效時間 ${otpConfig.ttlMinutes} 分鐘。`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>FROM DA ECHO CHALLENGE</h2>
        <p>你的驗證碼是：</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</div>
        <p>有效時間 ${otpConfig.ttlMinutes} 分鐘，請勿轉寄。</p>
      </div>
    `,
  })

  return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) })
}
