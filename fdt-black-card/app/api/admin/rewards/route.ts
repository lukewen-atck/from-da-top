import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { MemberRole, RewardStatus } from '@prisma/client'

// ============================================
// GET /api/admin/rewards
// 取得所有獎勵列表
// ============================================

export async function GET() {
  try {
    const rewards = await prisma.reward.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { claimedBy: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: rewards,
    })
  } catch (error) {
    console.error('[ADMIN_REWARDS_GET_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}

// ============================================
// POST /api/admin/rewards
// 新增獎勵
// ============================================

interface CreateRewardRequest {
  name: string
  description?: string
  imageUrl?: string
  pointsCost: number
  requiredRole?: 'FOUNDER' | 'VIP' | 'MEMBER' | null
  totalQuantity?: number | null
  startAt?: string | null
  endAt?: string | null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateRewardRequest
    const { 
      name, 
      description, 
      imageUrl, 
      pointsCost, 
      requiredRole, 
      totalQuantity,
      startAt,
      endAt 
    } = body

    // 驗證
    if (!name || !pointsCost) {
      return NextResponse.json(
        { success: false, message: '請填寫獎勵名稱和所需點數' },
        { status: 400 }
      )
    }

    if (pointsCost <= 0) {
      return NextResponse.json(
        { success: false, message: '所需點數必須大於 0' },
        { status: 400 }
      )
    }

    const reward = await prisma.reward.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        pointsCost,
        requiredRole: requiredRole as MemberRole | null,
        totalQuantity: totalQuantity || null,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        status: RewardStatus.AVAILABLE,
      },
    })

    return NextResponse.json({
      success: true,
      message: '獎勵建立成功',
      data: reward,
    })
  } catch (error) {
    console.error('[ADMIN_REWARDS_POST_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH /api/admin/rewards
// 更新獎勵狀態
// ============================================

interface UpdateRewardRequest {
  id: string
  status?: 'AVAILABLE' | 'DISABLED'
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as UpdateRewardRequest
    const { id, status } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少獎勵 ID' },
        { status: 400 }
      )
    }

    const reward = await prisma.reward.update({
      where: { id },
      data: {
        status: status as RewardStatus,
      },
    })

    return NextResponse.json({
      success: true,
      message: status === 'AVAILABLE' ? '獎勵已上架' : '獎勵已下架',
      data: reward,
    })
  } catch (error) {
    console.error('[ADMIN_REWARDS_PATCH_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}

// ============================================
// DELETE /api/admin/rewards
// 刪除獎勵
// ============================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少獎勵 ID' },
        { status: 400 }
      )
    }

    await prisma.reward.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: '獎勵已刪除',
    })
  } catch (error) {
    console.error('[ADMIN_REWARDS_DELETE_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}





