import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// GET /api/missions - 取得當前可執行的任務列表
export async function GET() {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }
    
    // 取得用戶
    const user = await prisma.user.findUnique({
      where: { clerkId },
    })
    
    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
    }
    
    const now = new Date()
    
    // 取得所有啟用中且在有效期間內的任務
    const missions = await prisma.mission.findMany({
      where: {
        isActive: true,
        OR: [
          { startAt: null },
          { startAt: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endAt: null },
              { endAt: { gte: now } },
            ],
          },
        ],
      },
      include: {
        records: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            records: {
              where: {
                status: 'APPROVED',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // 過濾掉已達到個人完成上限的任務
    const availableMissions = missions.map((mission) => {
      const userCompletedCount = mission.records.filter(
        (r) => r.status === 'APPROVED'
      ).length
      const userPendingCount = mission.records.filter(
        (r) => r.status === 'PENDING'
      ).length
      
      const canComplete = userCompletedCount < mission.perUserLimit
      const hasPending = userPendingCount > 0
      
      // 檢查全局完成上限
      const globalCompleted = mission._count.records
      const globalLimitReached = mission.maxCompletions 
        ? globalCompleted >= mission.maxCompletions 
        : false
      
      return {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        imageUrl: mission.imageUrl,
        type: mission.type,
        points: mission.points,
        startAt: mission.startAt,
        endAt: mission.endAt,
        perUserLimit: mission.perUserLimit,
        userCompletedCount,
        userPendingCount,
        canComplete: canComplete && !globalLimitReached && !hasPending,
        hasPending,
        globalLimitReached,
      }
    })
    
    return NextResponse.json({
      missions: availableMissions,
    })
  } catch (error) {
    console.error('取得任務列表失敗:', error)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}



