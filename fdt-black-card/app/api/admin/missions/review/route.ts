import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// POST /api/admin/missions/review - 管理員審核任務
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }
    
    // TODO: 加入管理員權限檢查
    // 這裡可以檢查 clerkId 是否在管理員名單中
    
    const body = await request.json()
    const { recordId, action, reason } = body
    
    if (!recordId) {
      return NextResponse.json({ error: '缺少紀錄 ID' }, { status: 400 })
    }
    
    if (!action || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: '無效的操作' }, { status: 400 })
    }
    
    // 取得任務紀錄
    const record = await prisma.missionRecord.findUnique({
      where: { id: recordId },
      include: {
        mission: true,
        user: true,
      },
    })
    
    if (!record) {
      return NextResponse.json({ error: '紀錄不存在' }, { status: 404 })
    }
    
    if (record.status !== 'PENDING') {
      return NextResponse.json({ error: '此紀錄已審核過' }, { status: 400 })
    }
    
    const now = new Date()
    
    if (action === 'APPROVE') {
      // 使用 Transaction 更新狀態並發放點數
      const result = await prisma.$transaction(async (tx) => {
        // 更新紀錄狀態
        const updatedRecord = await tx.missionRecord.update({
          where: { id: recordId },
          data: {
            status: 'APPROVED',
            reviewedAt: now,
            reviewedBy: clerkId,
            pointsAwarded: record.mission.points,
          },
        })
        
        // 更新用戶點數
        const updatedUser = await tx.user.update({
          where: { id: record.userId },
          data: {
            currentPoints: { increment: record.mission.points },
            totalPoints: { increment: record.mission.points },
          },
        })
        
        // 寫入點數帳本
        await tx.pointLedger.create({
          data: {
            userId: record.userId,
            type: 'EARN',
            amount: record.mission.points,
            balance: updatedUser.currentPoints,
            description: `完成任務：${record.mission.title}`,
            referenceId: recordId,
            referenceType: 'MISSION',
          },
        })
        
        return { updatedRecord, updatedUser }
      })
      
      return NextResponse.json({
        success: true,
        message: '已通過審核',
        record: {
          id: result.updatedRecord.id,
          status: result.updatedRecord.status,
          pointsAwarded: record.mission.points,
        },
        user: {
          id: result.updatedUser.id,
          memberNo: result.updatedUser.memberNo,
          currentPoints: result.updatedUser.currentPoints,
        },
      })
    } else {
      // REJECT - 拒絕
      if (!reason) {
        return NextResponse.json({ error: '請提供拒絕原因' }, { status: 400 })
      }
      
      const updatedRecord = await prisma.missionRecord.update({
        where: { id: recordId },
        data: {
          status: 'REJECTED',
          reviewedAt: now,
          reviewedBy: clerkId,
          rejectionReason: reason,
        },
      })
      
      return NextResponse.json({
        success: true,
        message: '已拒絕',
        record: {
          id: updatedRecord.id,
          status: updatedRecord.status,
          rejectionReason: reason,
        },
      })
    }
  } catch (error) {
    console.error('審核任務失敗:', error)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}



