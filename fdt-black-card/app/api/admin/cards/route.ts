import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { MemberRole, CardStatus } from '@prisma/client'

// ============================================
// GET /api/admin/cards
// 取得所有卡片列表
// ============================================

export async function GET() {
  try {
    const cards = await prisma.card.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            memberNo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: cards,
    })
  } catch (error) {
    console.error('[ADMIN_CARDS_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}

// ============================================
// POST /api/admin/cards
// 新增卡片
// ============================================

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      uid, 
      preAssignedRole, 
      preAssignedMemberNo, 
      cardName, 
      cardDescription,
      batchNo 
    } = body

    // 驗證必填欄位
    if (!uid || !preAssignedRole || !preAssignedMemberNo) {
      return NextResponse.json(
        { success: false, message: '請填寫 UID、身份和會員編號' },
        { status: 400 }
      )
    }

    // 檢查 UID 是否已存在
    const existingCard = await prisma.card.findUnique({
      where: { uid },
    })

    if (existingCard) {
      return NextResponse.json(
        { success: false, message: '此 UID 已存在' },
        { status: 400 }
      )
    }

    // 檢查會員編號是否已被預設使用
    const existingMemberNo = await prisma.card.findFirst({
      where: { preAssignedMemberNo },
    })

    if (existingMemberNo) {
      return NextResponse.json(
        { success: false, message: '此會員編號已被其他卡片使用' },
        { status: 400 }
      )
    }

    // 建立卡片
    const card = await prisma.card.create({
      data: {
        uid,
        preAssignedRole: preAssignedRole as MemberRole,
        preAssignedMemberNo,
        cardName: cardName || `卡片 ${preAssignedMemberNo}`,
        cardDescription: cardDescription || null,
        batchNo: batchNo || null,
        status: CardStatus.UNBOUND,
      },
    })

    return NextResponse.json({
      success: true,
      message: '卡片建立成功',
      data: card,
    })
  } catch (error) {
    console.error('[ADMIN_CARDS_POST_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH /api/admin/cards
// 更新卡片狀態
// ============================================

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: '缺少必要參數' },
        { status: 400 }
      )
    }

    const card = await prisma.card.update({
      where: { id },
      data: { status: status as CardStatus },
    })

    return NextResponse.json({
      success: true,
      message: '卡片狀態已更新',
      data: card,
    })
  } catch (error) {
    console.error('[ADMIN_CARDS_PATCH_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}

// ============================================
// DELETE /api/admin/cards
// 刪除卡片（僅限未綁定）
// ============================================

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少卡片 ID' },
        { status: 400 }
      )
    }

    // 檢查卡片是否存在且未綁定
    const card = await prisma.card.findUnique({
      where: { id },
    })

    if (!card) {
      return NextResponse.json(
        { success: false, message: '找不到此卡片' },
        { status: 404 }
      )
    }

    if (card.status === CardStatus.BOUND) {
      return NextResponse.json(
        { success: false, message: '已綁定的卡片無法刪除' },
        { status: 400 }
      )
    }

    await prisma.card.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: '卡片已刪除',
    })
  } catch (error) {
    console.error('[ADMIN_CARDS_DELETE_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}





