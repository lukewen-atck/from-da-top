import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { MissionType } from '@prisma/client'

// GET /api/admin/missions - 取得所有任務和待審核紀錄
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const includeRecords = searchParams.get('includeRecords') === 'true'
    const pendingOnly = searchParams.get('pendingOnly') === 'true'
    
    // 取得所有任務
    const missions = await prisma.mission.findMany({
      include: {
        _count: {
          select: {
            records: true,
          },
        },
        records: includeRecords ? {
          where: pendingOnly ? { status: 'PENDING' } : undefined,
          include: {
            user: {
              select: {
                id: true,
                memberNo: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        } : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // 取得所有待審核紀錄數量
    const pendingCount = await prisma.missionRecord.count({
      where: { status: 'PENDING' },
    })
    
    return NextResponse.json({
      missions,
      pendingCount,
    })
  } catch (error) {
    console.error('取得任務列表失敗:', error)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}

// POST /api/admin/missions - 新增任務
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }
    
    const body = await request.json()
    const {
      title,
      description,
      imageUrl,
      type,
      points,
      secretCode,
      startAt,
      endAt,
      maxCompletions,
      perUserLimit,
    } = body
    
    if (!title || !type || !points) {
      return NextResponse.json({ error: '請填寫必要欄位' }, { status: 400 })
    }
    
    // 驗證任務類型
    if (!['UPLOAD_PROOF', 'OFFLINE_SCAN', 'SECRET_CODE'].includes(type)) {
      return NextResponse.json({ error: '無效的任務類型' }, { status: 400 })
    }
    
    // SECRET_CODE 類型需要設定密語
    if (type === 'SECRET_CODE' && !secretCode) {
      return NextResponse.json({ error: '請設定通關密語' }, { status: 400 })
    }
    
    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        imageUrl,
        type: type as MissionType,
        points: parseInt(points),
        secretCode: type === 'SECRET_CODE' ? secretCode : null,
        startAt: startAt ? new Date(startAt) : null,
        endAt: endAt ? new Date(endAt) : null,
        maxCompletions: maxCompletions ? parseInt(maxCompletions) : null,
        perUserLimit: perUserLimit ? parseInt(perUserLimit) : 1,
        isActive: true,
      },
    })
    
    return NextResponse.json({
      success: true,
      mission,
    })
  } catch (error) {
    console.error('新增任務失敗:', error)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}

// PATCH /api/admin/missions - 更新任務
export async function PATCH(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }
    
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({ error: '缺少任務 ID' }, { status: 400 })
    }
    
    // 處理數字欄位
    if (updateData.points) {
      updateData.points = parseInt(updateData.points)
    }
    if (updateData.maxCompletions) {
      updateData.maxCompletions = parseInt(updateData.maxCompletions)
    }
    if (updateData.perUserLimit) {
      updateData.perUserLimit = parseInt(updateData.perUserLimit)
    }
    
    // 處理日期欄位
    if (updateData.startAt) {
      updateData.startAt = new Date(updateData.startAt)
    }
    if (updateData.endAt) {
      updateData.endAt = new Date(updateData.endAt)
    }
    
    const mission = await prisma.mission.update({
      where: { id },
      data: updateData,
    })
    
    return NextResponse.json({
      success: true,
      mission,
    })
  } catch (error) {
    console.error('更新任務失敗:', error)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}

// DELETE /api/admin/missions - 刪除任務
export async function DELETE(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: '缺少任務 ID' }, { status: 400 })
    }
    
    // 檢查是否有相關紀錄
    const recordCount = await prisma.missionRecord.count({
      where: { missionId: id },
    })
    
    if (recordCount > 0) {
      // 有紀錄的話只停用，不刪除
      await prisma.mission.update({
        where: { id },
        data: { isActive: false },
      })
      
      return NextResponse.json({
        success: true,
        message: '任務已停用（因有相關紀錄）',
      })
    }
    
    // 沒有紀錄則刪除
    await prisma.mission.delete({
      where: { id },
    })
    
    return NextResponse.json({
      success: true,
      message: '任務已刪除',
    })
  } catch (error) {
    console.error('刪除任務失敗:', error)
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 })
  }
}



