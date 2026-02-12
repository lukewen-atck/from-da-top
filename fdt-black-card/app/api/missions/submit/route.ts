import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// POST /api/missions/submit - 用戶提交任務
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }
    
    const body = await request.json()
    const { missionId, proofUrl, proofNote, secretCode } = body
    
    if (!missionId) {
      return NextResponse.json({ error: '缺少任務 ID' }, { status: 400 })
    }
    
    // 取得用戶
    const user = await prisma.user.findUnique({
      where: { clerkId },
    })
    
    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
    }
    
    // 取得任務
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        records: {
          where: { userId: user.id },
        },
        _count: {
          select: {
            records: {
              where: { status: 'APPROVED' },
            },
          },
        },
      },
    })
    
    if (!mission) {
      return NextResponse.json({ error: '任務不存在' }, { status: 404 })
    }
    
    // 檢查任務是否啟用
    if (!mission.isActive) {
      return NextResponse.json({ error: '任務已下架' }, { status: 400 })
    }
    
    // 檢查任務時間
    const now = new Date()
    if (mission.startAt && mission.startAt > now) {
      return NextResponse.json({ error: '任務尚未開始' }, { status: 400 })
    }
    if (mission.endAt && mission.endAt < now) {
      return NextResponse.json({ error: '任務已結束' }, { status: 400 })
    }
    
    // 檢查個人完成次數
    const userCompletedCount = mission.records.filter(
      (r) => r.status === 'APPROVED'
    ).length
    if (userCompletedCount >= mission.perUserLimit) {
      return NextResponse.json({ error: '已達到個人完成上限' }, { status: 400 })
    }
    
    // 檢查是否有待審核的
    const hasPending = mission.records.some((r) => r.status === 'PENDING')
    if (hasPending) {
      return NextResponse.json({ error: '您有待審核的提交' }, { status: 400 })
    }
    
    // 檢查全局完成上限
    if (mission.maxCompletions && mission._count.records >= mission.maxCompletions) {
      return NextResponse.json({ error: '任務已達成上限' }, { status: 400 })
    }
    
    // 根據任務類型處理
    switch (mission.type) {
      case 'UPLOAD_PROOF': {
        // 需要上傳證明圖片
        if (!proofUrl) {
          return NextResponse.json({ error: '請上傳證明圖片' }, { status: 400 })
        }
        
        // 建立待審核紀錄
        const record = await prisma.missionRecord.create({
          data: {
            userId: user.id,
            missionId: mission.id,
            status: 'PENDING',
            proofUrl,
            proofNote,
          },
        })
        
        return NextResponse.json({
          success: true,
          message: '已提交，等待審核',
          record: {
            id: record.id,
            status: record.status,
          },
        })
      }
      
      case 'OFFLINE_SCAN': {
        // 線下掃碼 - 直接建立待審核紀錄
        const record = await prisma.missionRecord.create({
          data: {
            userId: user.id,
            missionId: mission.id,
            status: 'PENDING',
            proofNote: proofNote || '線下掃碼提交',
          },
        })
        
        return NextResponse.json({
          success: true,
          message: '已提交，等待審核',
          record: {
            id: record.id,
            status: record.status,
          },
        })
      }
      
      case 'SECRET_CODE': {
        // 通關密語 - 比對後直接通過
        if (!secretCode) {
          return NextResponse.json({ error: '請輸入通關密語' }, { status: 400 })
        }
        
        // 比對密語 (不區分大小寫，去除前後空白)
        const isCorrect = 
          mission.secretCode?.toLowerCase().trim() === 
          secretCode.toLowerCase().trim()
        
        if (!isCorrect) {
          return NextResponse.json({ error: '通關密語錯誤' }, { status: 400 })
        }
        
        // 使用 Transaction 建立紀錄並發放點數
        const result = await prisma.$transaction(async (tx) => {
          // 建立已通過的紀錄
          const record = await tx.missionRecord.create({
            data: {
              userId: user.id,
              missionId: mission.id,
              status: 'APPROVED',
              proofNote: '通關密語正確',
              reviewedAt: now,
              pointsAwarded: mission.points,
            },
          })
          
          // 更新用戶點數
          const updatedUser = await tx.user.update({
            where: { id: user.id },
            data: {
              currentPoints: { increment: mission.points },
              totalPoints: { increment: mission.points },
            },
          })
          
          // 寫入點數帳本
          await tx.pointLedger.create({
            data: {
              userId: user.id,
              type: 'EARN',
              amount: mission.points,
              balance: updatedUser.currentPoints,
              description: `完成任務：${mission.title}`,
              referenceId: record.id,
              referenceType: 'MISSION',
            },
          })
          
          return { record, updatedUser }
        })
        
        return NextResponse.json({
          success: true,
          message: `恭喜！獲得 ${mission.points} 點`,
          record: {
            id: result.record.id,
            status: result.record.status,
            pointsAwarded: mission.points,
          },
          currentPoints: result.updatedUser.currentPoints,
        })
      }
      
      default:
        return NextResponse.json({ error: '不支援的任務類型' }, { status: 400 })
    }
  } catch (error) {
    console.error('提交任務失敗:', error)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}



