import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { CardStatus } from '@prisma/client'

// ============================================
// POST /api/card/bind
// 綁定 NFC 卡片到用戶帳號
// ============================================

interface BindCardRequest {
  uid: string // NFC 卡片 UID
}

interface BindCardResponse {
  success: boolean
  message: string
  data?: {
    memberNo: string
    memberRole: string
    cardName: string | null
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<BindCardResponse>> {
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
    const body = await request.json() as BindCardRequest
    const { uid } = body

    if (!uid || typeof uid !== 'string') {
      return NextResponse.json(
        { success: false, message: '缺少卡片 UID' },
        { status: 400 }
      )
    }

    // 3. 使用 Transaction 確保資料一致性
    const result = await prisma.$transaction(async (tx) => {
      // 3.1 查詢卡片
      const card = await tx.card.findUnique({
        where: { uid },
        include: { user: true }
      })

      if (!card) {
        throw new Error('CARD_NOT_FOUND')
      }

      if (card.status === CardStatus.DISABLED) {
        throw new Error('CARD_DISABLED')
      }

      if (card.status === CardStatus.BOUND) {
        throw new Error('CARD_ALREADY_BOUND')
      }

      // 3.2 查詢或建立用戶
      let user = await tx.user.findUnique({
        where: { clerkId }
      })

      // 如果用戶已存在且已綁定其他卡片
      if (user?.memberNo) {
        throw new Error('USER_ALREADY_HAS_CARD')
      }

      // 取得 Clerk 用戶資訊
      const clerkUser = await currentUser()

      if (!user) {
        // 建立新用戶並繼承卡片預設身分
        user = await tx.user.create({
          data: {
            clerkId,
            email: clerkUser?.emailAddresses[0]?.emailAddress,
            name: clerkUser?.firstName 
              ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
              : null,
            avatarUrl: clerkUser?.imageUrl,
            memberRole: card.preAssignedRole,
            memberNo: card.preAssignedMemberNo,
          }
        })
      } else {
        // 更新現有用戶的會員資訊
        user = await tx.user.update({
          where: { id: user.id },
          data: {
            memberRole: card.preAssignedRole,
            memberNo: card.preAssignedMemberNo,
          }
        })
      }

      // 3.3 更新卡片狀態
      const updatedCard = await tx.card.update({
        where: { id: card.id },
        data: {
          status: CardStatus.BOUND,
          userId: user.id,
          boundAt: new Date(),
        }
      })

      // 3.4 記錄點數帳本 (贈送初始點數，可選)
      // 如果需要贈送初始點數，取消下方註解
      /*
      const initialPoints = 100 // 初始贈點
      await tx.pointLedger.create({
        data: {
          userId: user.id,
          type: 'BONUS',
          amount: initialPoints,
          balance: initialPoints,
          description: '新會員綁卡贈點',
          referenceId: card.id,
          referenceType: 'CARD_BIND',
        }
      })
      
      await tx.user.update({
        where: { id: user.id },
        data: {
          totalPoints: { increment: initialPoints },
          currentPoints: { increment: initialPoints },
        }
      })
      */

      return {
        user,
        card: updatedCard,
      }
    })

    // 4. 回傳成功結果
    return NextResponse.json({
      success: true,
      message: '卡片綁定成功',
      data: {
        memberNo: result.user.memberNo!,
        memberRole: result.user.memberRole,
        cardName: result.card.cardName,
      }
    })

  } catch (error) {
    console.error('[CARD_BIND_ERROR]', error)

    // 處理已知錯誤
    if (error instanceof Error) {
      switch (error.message) {
        case 'CARD_NOT_FOUND':
          return NextResponse.json(
            { success: false, message: '找不到此卡片，請確認 NFC 卡片是否有效' },
            { status: 404 }
          )
        case 'CARD_DISABLED':
          return NextResponse.json(
            { success: false, message: '此卡片已被停用' },
            { status: 403 }
          )
        case 'CARD_ALREADY_BOUND':
          return NextResponse.json(
            { success: false, message: '此卡片已被其他帳號綁定' },
            { status: 409 }
          )
        case 'USER_ALREADY_HAS_CARD':
          return NextResponse.json(
            { success: false, message: '您已綁定其他卡片，每個帳號只能綁定一張卡片' },
            { status: 409 }
          )
      }
    }

    // 未知錯誤
    return NextResponse.json(
      { success: false, message: '系統錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}

// ============================================
// GET /api/card/bind?uid=xxx
// 查詢卡片綁定狀態 (用於前端預先檢查)
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get('uid')

    if (!uid) {
      return NextResponse.json(
        { success: false, message: '缺少卡片 UID' },
        { status: 400 }
      )
    }

    const card = await prisma.card.findUnique({
      where: { uid },
      select: {
        uid: true,
        status: true,
        preAssignedRole: true,
        cardName: true,
        cardDescription: true,
      }
    })

    if (!card) {
      return NextResponse.json(
        { success: false, message: '找不到此卡片' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        uid: card.uid,
        status: card.status,
        preAssignedRole: card.preAssignedRole,
        cardName: card.cardName,
        cardDescription: card.cardDescription,
        canBind: card.status === CardStatus.UNBOUND,
      }
    })

  } catch (error) {
    console.error('[CARD_STATUS_ERROR]', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤' },
      { status: 500 }
    )
  }
}





