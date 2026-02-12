import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashOtpCode, isEmailValid } from '@/lib/otp'

type RequestBody = {
  email?: string
  code?: string
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
  const { email, code } = (await request.json()) as RequestBody

  if (!email || !code || !isEmailValid(email) || !/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400, headers: getCorsHeaders(request) }
    )
  }

  const codeHash = hashOtpCode(code, email)

  const otpRecord = await prisma.echoOtpCode.findFirst({
    where: {
      email,
      codeHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!otpRecord) {
    return NextResponse.json(
      { error: 'Invalid or expired code' },
      { status: 401, headers: getCorsHeaders(request) }
    )
  }

  const account = await prisma.echoAccount.upsert({
    where: { email },
    update: { lastLoginAt: new Date() },
    create: {
      email,
      lastLoginAt: new Date(),
    },
  })

  await prisma.echoOtpCode.update({
    where: { id: otpRecord.id },
    data: { usedAt: new Date() },
  })

  return NextResponse.json(
    {
      success: true,
      account: {
        id: account.id,
        email: account.email,
        lastLoginAt: account.lastLoginAt,
      },
    },
    { headers: getCorsHeaders(request) }
  )
}
