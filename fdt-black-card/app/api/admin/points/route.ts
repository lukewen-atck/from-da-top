import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PointTransactionType } from '@prisma/client'

// ============================================
// POST /api/admin/points
// 發放點數給會員
// ============================================

interface AddPointsRequest {
  userId: string
  amount: number
  type: 'EARN' | 'BONUS' | 'ADJUST'
  description?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AddPointsRequest
    const { userId, amount, type, description } = body

    // 驗證
    if (!userId || !amount || !type) {
      return NextResponse.json(
        { success: false, message: '缺少必要參數' },
        { status: 400 }
      )
    }

    if (amount === 0) {
      return NextResponse.json(
        { success: false, message: '點數不能為 0' },
        { status: 400 }
      )
    }

    // 使用 Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 查詢用戶
      const user = await tx.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new Error('USER_NOT_FOUND')
      }

      // 計算新餘額
      const newCurrentPoints = user.currentPoints + amount
      const newTotalPoints = amount > 0 
        ? user.totalPoints + amount 
        : user.totalPoints

      if (newCurrentPoints < 0) {
        throw new Error('INSUFFICIENT_POINTS')
      }

      // 更新用戶點數
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          currentPoints: newCurrentPoints,
          totalPoints: newTotalPoints,
        },
      })

      // 建立點數紀錄
      const pointRecord = await tx.pointLedger.create({
        data: {
          userId,
          type: type as PointTransactionType,
          amount,
          balance: newCurrentPoints,
          description: description || (amount > 0 ? '管理員發放' : '管理員扣除'),
          referenceType: 'ADMIN',
        },
      })

      return { user: updatedUser, pointRecord }
    })

    return NextResponse.json({
      success: true,
      message: amount > 0 ? '點數發放成功' : '點數扣除成功',
      data: {
        userId: result.user.id,
        memberNo: result.user.memberNo,
        currentPoints: result.user.currentPoints,
        totalPoints: result.user.totalPoints,
        transactionId: result.pointRecord.id,
      },
    })
  } catch (error) {
    console.error('[ADMIN_POINTS_ERROR]', error)

    if (error instanceof Error) {
      switch (error.message) {
        case 'USER_NOT_FOUND':
          return NextResponse.json(
            { success: false, message: '找不到此會員' },
            { status: 404 }
          )
        case 'INSUFFICIENT_POINTS':
          return NextResponse.json(
            { success: false, message: '點數不足，無法扣除' },
            { status: 400 }
          )
      }
    }

    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}





