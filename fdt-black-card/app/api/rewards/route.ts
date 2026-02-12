import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { RewardStatus } from '@prisma/client'

// ============================================
// GET /api/rewards
// 取得可用獎勵列表
// ============================================

export async function GET() {
  try {
    const { userId: clerkId } = await auth()

    // 查詢用戶資訊（用於檢查會員等級）
    let userRole = null
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkId },
        select: { memberRole: true },
      })
      userRole = user?.memberRole
    }

    // 查詢可用獎勵
    const rewards = await prisma.reward.findMany({
      where: {
        status: RewardStatus.AVAILABLE,
        OR: [
          { startAt: null },
          { startAt: { lte: new Date() } },
        ],
        AND: [
          {
            OR: [
              { endAt: null },
              { endAt: { gte: new Date() } },
            ],
          },
        ],
      },
      orderBy: { pointsCost: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        pointsCost: true,
        requiredRole: true,
        totalQuantity: true,
        claimedQuantity: true,
        startAt: true,
        endAt: true,
      },
    })

    // 計算剩餘數量與用戶是否可兌換
    const rewardsWithAvailability = rewards.map((reward) => {
      const remainingQuantity = reward.totalQuantity 
        ? reward.totalQuantity - reward.claimedQuantity 
        : null

      // 檢查會員等級要求
      let canClaim = true
      if (reward.requiredRole) {
        const roleHierarchy = ['GUEST', 'MEMBER', 'VIP', 'FOUNDER']
        const requiredIndex = roleHierarchy.indexOf(reward.requiredRole)
        const userIndex = userRole ? roleHierarchy.indexOf(userRole) : -1
        canClaim = userIndex >= requiredIndex
      }

      // 檢查是否還有庫存
      if (remainingQuantity !== null && remainingQuantity <= 0) {
        canClaim = false
      }

      return {
        ...reward,
        remainingQuantity,
        canClaim,
        isLimited: reward.totalQuantity !== null,
      }
    })

    return NextResponse.json({
      success: true,
      data: rewardsWithAvailability,
    })
  } catch (error) {
    console.error('[REWARDS_GET_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}





