import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { put } from '@vercel/blob'

// POST /api/upload - 上傳圖片
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ error: '請選擇檔案' }, { status: 400 })
    }
    
    // 檢查檔案類型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '只支援 JPG、PNG、GIF、WebP 格式' }, { status: 400 })
    }
    
    // 檢查檔案大小 (最大 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: '檔案大小不能超過 5MB' }, { status: 400 })
    }
    
    // 產生唯一檔名
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `missions/${clerkId}/${timestamp}.${extension}`
    
    // 上傳到 Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    })
    
    return NextResponse.json({
      success: true,
      url: blob.url,
    })
  } catch (error) {
    console.error('上傳失敗:', error)
    return NextResponse.json({ error: '上傳失敗，請稍後再試' }, { status: 500 })
  }
}



