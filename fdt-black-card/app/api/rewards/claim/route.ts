import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { RewardStatus } from '@prisma/client'

// ============================================
// POST /api/rewards/claim
// 兌換獎勵
// ============================================

interface ClaimRewardRequest {
  rewardId: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. 驗證用戶登入狀態
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json(
        { success: false, message: '請先登入' },
        { status: 401 }
      )
    }

    // 2. 取得請求內容
    const body = await request.json() as ClaimRewardRequest
    const { rewardId } = body

    if (!rewardId) {
      return NextResponse.json(
        { success: false, message: '缺少獎勵 ID' },
        { status: 400 }
      )
    }

    // 3. 使用 Transaction 確保資料一致性
    const result = await prisma.$transaction(async (tx) => {
      // 3.1 查詢用戶
      const user = await tx.user.findUnique({
        where: { clerkId },
      })

      if (!user) {
        throw new Error('USER_NOT_FOUND')
      }

      if (!user.memberNo) {
        throw new Error('NOT_A_MEMBER')
      }

      // 3.2 查詢獎勵
      const reward = await tx.reward.findUnique({
        where: { id: rewardId },
      })

      if (!reward) {
        throw new Error('REWARD_NOT_FOUND')
      }

      if (reward.status !== RewardStatus.AVAILABLE) {
        throw new Error('REWARD_NOT_AVAILABLE')
      }

      // 3.3 檢查時間限制
      const now = new Date()
      if (reward.startAt && now < reward.startAt) {
        throw new Error('REWARD_NOT_STARTED')
      }
      if (reward.endAt && now > reward.endAt) {
        throw new Error('REWARD_EXPIRED')
      }

      // 3.4 檢查庫存
      if (reward.totalQuantity !== null) {
        if (reward.claimedQuantity >= reward.totalQuantity) {
          throw new Error('REWARD_OUT_OF_STOCK')
        }
      }

      // 3.5 檢查會員等級
      if (reward.requiredRole) {
        const roleHierarchy = ['GUEST', 'MEMBER', 'VIP', 'FOUNDER']
        const requiredIndex = roleHierarchy.indexOf(reward.requiredRole)
        const userIndex = roleHierarchy.indexOf(user.memberRole)
        
        if (userIndex < requiredIndex) {
          throw new Error('INSUFFICIENT_ROLE')
        }
      }

      // 3.6 檢查點數是否足夠
      if (user.currentPoints < reward.pointsCost) {
        throw new Error('INSUFFICIENT_POINTS')
      }

      // 3.7 扣除點數
      const newCurrentPoints = user.currentPoints - reward.pointsCost

      await tx.user.update({
        where: { id: user.id },
        data: {
          currentPoints: newCurrentPoints,
        },
      })

      // 3.8 建立點數紀錄
      await tx.pointLedger.create({
        data: {
          userId: user.id,
          type: 'REDEEM',
          amount: -reward.pointsCost,
          balance: newCurrentPoints,
          description: `兌換獎勵：${reward.name}`,
          referenceId: reward.id,
          referenceType: 'REWARD',
        },
      })

      // 3.9 建立兌換紀錄
      const userReward = await tx.userReward.create({
        data: {
          userId: user.id,
          rewardId: reward.id,
          pointsSpent: reward.pointsCost,
        },
      })

      // 3.10 更新獎勵已兌換數量
      await tx.reward.update({
        where: { id: reward.id },
        data: {
          claimedQuantity: { increment: 1 },
        },
      })

      return {
        userReward,
        reward,
        newCurrentPoints,
      }
    })

    return NextResponse.json({
      success: true,
      message: '兌換成功！',
      data: {
        rewardName: result.reward.name,
        pointsSpent: result.reward.pointsCost,
        remainingPoints: result.newCurrentPoints,
      },
    })

  } catch (error) {
    console.error('[REWARD_CLAIM_ERROR]', error)

    if (error instanceof Error) {
      switch (error.message) {
        case 'USER_NOT_FOUND':
          return NextResponse.json(
            { success: false, message: '找不到用戶資料' },
            { status: 404 }
          )
        case 'NOT_A_MEMBER':
          return NextResponse.json(
            { success: false, message: '請先綁定會員卡' },
            { status: 403 }
          )
        case 'REWARD_NOT_FOUND':
          return NextResponse.json(
            { success: false, message: '找不到此獎勵' },
            { status: 404 }
          )
        case 'REWARD_NOT_AVAILABLE':
          return NextResponse.json(
            { success: false, message: '此獎勵目前無法兌換' },
            { status: 400 }
          )
        case 'REWARD_NOT_STARTED':
          return NextResponse.json(
            { success: false, message: '此獎勵尚未開始' },
            { status: 400 }
          )
        case 'REWARD_EXPIRED':
          return NextResponse.json(
            { success: false, message: '此獎勵已過期' },
            { status: 400 }
          )
        case 'REWARD_OUT_OF_STOCK':
          return NextResponse.json(
            { success: false, message: '此獎勵已兌換完畢' },
            { status: 400 }
          )
        case 'INSUFFICIENT_ROLE':
          return NextResponse.json(
            { success: false, message: '您的會員等級不足' },
            { status: 403 }
          )
        case 'INSUFFICIENT_POINTS':
          return NextResponse.json(
            { success: false, message: '點數不足' },
            { status: 400 }
          )
      }
    }

    return NextResponse.json(
      { success: false, message: '系統錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}





