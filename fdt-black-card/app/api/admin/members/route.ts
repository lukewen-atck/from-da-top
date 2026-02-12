import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// ============================================
// GET /api/admin/members
// 取得所有會員列表
// ============================================

export async function GET() {
  try {
    const members = await prisma.user.findMany({
      where: {
        memberNo: { not: null }, // 只顯示已綁定卡片的用戶
      },
      include: {
        card: {
          select: {
            uid: true,
            cardName: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: members,
    })
  } catch (error) {
    console.error('[ADMIN_MEMBERS_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH /api/admin/members
// 更新會員資料（會員編號）
// ============================================

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { userId, memberNo } = body

    if (!userId || !memberNo) {
      return NextResponse.json(
        { success: false, message: '缺少必要參數' },
        { status: 400 }
      )
    }

    // 檢查會員編號是否已被使用
    const existingMember = await prisma.user.findFirst({
      where: {
        memberNo: memberNo,
        id: { not: userId },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { success: false, message: '此會員編號已被使用' },
        { status: 400 }
      )
    }

    // 更新會員編號
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { memberNo },
    })

    return NextResponse.json({
      success: true,
      message: '會員編號已更新',
      data: updatedUser,
    })
  } catch (error) {
    console.error('[ADMIN_MEMBERS_PATCH_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}

