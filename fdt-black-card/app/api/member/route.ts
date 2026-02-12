import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// ============================================
// GET /api/member
// 取得當前登入用戶的會員資訊
// ============================================

export async function GET() {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json(
        { success: false, message: '請先登入' },
        { status: 401 }
      )
    }

    // 查詢用戶資訊，包含卡片和最近的點數記錄
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        card: {
          select: {
            uid: true,
            cardName: true,
            cardDescription: true,
            boundAt: true,
            batchNo: true,
          },
        },
        pointLedger: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            type: true,
            amount: true,
            balance: true,
            description: true,
            createdAt: true,
          },
        },
        claimedRewards: {
          orderBy: { claimedAt: 'desc' },
          take: 5,
          include: {
            reward: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                pointsCost: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: '尚未綁定會員卡', code: 'NO_MEMBERSHIP' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        memberRole: user.memberRole,
        memberNo: user.memberNo,
        totalPoints: user.totalPoints,
        currentPoints: user.currentPoints,
        card: user.card,
        recentPoints: user.pointLedger,
        recentRewards: user.claimedRewards,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('[MEMBER_GET_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}





