'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useUser, SignInButton, useClerk } from '@clerk/nextjs'
import { useState, useEffect, Suspense } from 'react'
import { CreditCard, Sparkles, CheckCircle2, XCircle, Loader2, LogIn, Crown, Star, User } from 'lucide-react'

// 卡片資訊類型
interface CardInfo {
  uid: string
  status: 'UNBOUND' | 'BOUND' | 'DISABLED'
  preAssignedRole: 'FOUNDER' | 'VIP' | 'MEMBER' | 'GUEST'
  cardName: string | null
  cardDescription: string | null
  canBind: boolean
}

// 綁定結果類型
interface BindResult {
  success: boolean
  message: string
  data?: {
    memberNo: string
    memberRole: string
    cardName: string | null
  }
}

// 角色配置
const roleConfig = {
  FOUNDER: {
    label: '創始會員',
    color: 'text-fdt-gold',
    bgColor: 'bg-fdt-gold/10',
    borderColor: 'border-fdt-gold/30',
    icon: Crown,
    gradient: 'from-fdt-gold to-amber-600',
  },
  VIP: {
    label: 'VIP 會員',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    icon: Star,
    gradient: 'from-purple-400 to-purple-600',
  },
  MEMBER: {
    label: '一般會員',
    color: 'text-fdt-silver',
    bgColor: 'bg-fdt-silver/10',
    borderColor: 'border-fdt-silver/30',
    icon: User,
    gradient: 'from-fdt-silver to-gray-400',
  },
  GUEST: {
    label: '訪客',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/30',
    icon: User,
    gradient: 'from-gray-400 to-gray-600',
  },
}

function BindPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const uid = searchParams.get('uid')
  const { isSignedIn, isLoaded, user } = useUser()
  const { openSignIn } = useClerk()

  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [binding, setBinding] = useState(false)
  const [bindResult, setBindResult] = useState<BindResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 取得卡片資訊
  useEffect(() => {
    async function fetchCardInfo() {
      if (!uid) {
        setError('缺少卡片 UID')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/card/bind?uid=${encodeURIComponent(uid)}`)
        const data = await res.json()

        if (data.success) {
          setCardInfo(data.data)
        } else {
          setError(data.message)
        }
      } catch {
        setError('無法取得卡片資訊')
      } finally {
        setLoading(false)
      }
    }

    fetchCardInfo()
  }, [uid])

  // 執行綁定
  async function handleBind() {
    if (!uid || !isSignedIn) return

    setBinding(true)
    setBindResult(null)

    try {
      const res = await fetch('/api/card/bind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      })

      const data = await res.json()
      setBindResult(data)

      if (data.success) {
        // 更新卡片狀態
        setCardInfo((prev) => prev ? { ...prev, status: 'BOUND', canBind: false } : null)
        // 2秒後自動跳轉到會員中心
        setTimeout(() => {
          router.push('/member')
        }, 2000)
      }
    } catch {
      setBindResult({
        success: false,
        message: '綁定失敗，請稍後再試',
      })
    } finally {
      setBinding(false)
    }
  }

  // 載入中
  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-fdt-gold animate-spin mx-auto mb-4" />
          <p className="text-muted">載入中...</p>
        </div>
      </div>
    )
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-card border border-red-500/30 rounded-2xl p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">無法載入卡片</h1>
            <p className="text-muted mb-6">{error}</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-card-hover border border-border rounded-lg hover:bg-border transition-colors"
            >
              返回首頁
            </a>
          </div>
        </div>
      </div>
    )
  }

  // 沒有 UID
  if (!uid || !cardInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <CreditCard className="w-16 h-16 text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">缺少卡片資訊</h1>
            <p className="text-muted mb-6">請掃描 NFC 卡片後再試</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-card-hover border border-border rounded-lg hover:bg-border transition-colors"
            >
              返回首頁
            </a>
          </div>
        </div>
      </div>
    )
  }

  const role = roleConfig[cardInfo.preAssignedRole]
  const RoleIcon = role.icon

  // 綁定成功
  if (bindResult?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* 成功卡片 */}
          <div className="bg-card border border-fdt-gold/30 rounded-2xl p-8 card-glow">
            {/* 成功動畫 */}
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-fdt-gold/10 flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-fdt-gold" />
              </div>
              <Sparkles className="absolute top-0 right-1/4 w-6 h-6 text-fdt-gold float" />
              <Sparkles className="absolute bottom-0 left-1/4 w-4 h-4 text-fdt-gold float" style={{ animationDelay: '0.5s' }} />
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">綁定成功！</h1>
            <p className="text-muted text-center mb-2">歡迎加入 FDT 會員</p>
            <p className="text-sm text-fdt-gold text-center mb-6 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              即將跳轉至會員中心...
            </p>

            {/* 會員資訊 */}
            <div className={`${role.bgColor} border ${role.borderColor} rounded-xl p-6 mb-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center`}>
                  <RoleIcon className="w-5 h-5 text-fdt-black" />
                </div>
                <div>
                  <p className="text-sm text-muted">會員身分</p>
                  <p className={`font-bold ${role.color}`}>{role.label}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">會員編號</p>
                  <p className="font-mono font-bold">{bindResult.data?.memberNo}</p>
                </div>
                <div>
                  <p className="text-muted">卡片名稱</p>
                  <p className="font-bold">{bindResult.data?.cardName || '-'}</p>
                </div>
              </div>
            </div>

            {/* 前往會員中心 */}
            <a
              href="/member"
              className="block w-full py-4 rounded-xl text-center font-bold btn-gold"
            >
              前往會員中心
            </a>
          </div>
        </div>
      </div>
    )
  }

  // 卡片已被綁定 - 導向登入或會員中心
  if (cardInfo.status === 'BOUND') {
    // 已登入 → 自動跳轉到會員中心
    if (isSignedIn) {
      // 使用 useEffect 來處理跳轉，避免在 render 中直接調用
      router.push('/member')
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-card border border-fdt-gold/30 rounded-2xl p-8 text-center">
              <Loader2 className="w-16 h-16 text-fdt-gold mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold mb-2">歡迎回來</h1>
              <p className="text-muted mb-6">正在跳轉至會員中心...</p>
            </div>
          </div>
        </div>
      )
    }

    // 未登入 → 顯示登入按鈕
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-card border border-fdt-gold/30 rounded-2xl p-8 text-center">
            <CreditCard className="w-16 h-16 text-fdt-gold mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">FDT 會員卡</h1>
            <p className="text-muted mb-6">請登入以查看您的會員資訊</p>
            <SignInButton mode="modal">
              <button className="w-full py-4 btn-gold rounded-xl text-lg font-bold">
                登入 / 註冊
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    )
  }

  // 卡片已停用
  if (cardInfo.status === 'DISABLED') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-card border border-red-500/30 rounded-2xl p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">卡片已停用</h1>
            <p className="text-muted mb-6">此卡片已被停用，無法綁定</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-card-hover border border-border rounded-lg hover:bg-border transition-colors"
            >
              返回首頁
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fdt-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="FROM DA TOP" 
            className="h-10 mx-auto mb-2"
          />
          <p className="text-muted">會員卡片綁定</p>
        </div>

        {/* 卡片預覽 */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 card-glow card-glow-hover transition-all">
          {/* 卡片外觀 */}
          <div className={`aspect-[1.586/1] rounded-xl bg-gradient-to-br from-fdt-dark to-fdt-darker border ${role.borderColor} p-6 relative overflow-hidden mb-6`}>
            {/* 光效 */}
            <div className="absolute inset-0 shimmer" />
            
            {/* 卡片內容 */}
            <div className="relative h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">FDT</p>
                  <p className={`font-bold ${role.color}`}>{role.label}</p>
                </div>
                <RoleIcon className={`w-8 h-8 ${role.color}`} />
              </div>
              
              <div>
                <p className="text-xs text-muted mb-1">卡片名稱</p>
                <p className="font-bold">{cardInfo.cardName || 'FDT Card'}</p>
              </div>
            </div>
          </div>

          {/* 卡片資訊 */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">預設身分</span>
              <span className={`font-bold ${role.color}`}>{role.label}</span>
            </div>
            {cardInfo.cardDescription && (
              <div className="flex justify-between">
                <span className="text-muted">說明</span>
                <span>{cardInfo.cardDescription}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">狀態</span>
              <span className="text-green-400">可綁定</span>
            </div>
          </div>
        </div>

        {/* 綁定錯誤 */}
        {bindResult && !bindResult.success && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-400">{bindResult.message}</p>
            </div>
          </div>
        )}

        {/* 操作區域 */}
        <div className="bg-card border border-border rounded-2xl p-6">
          {isSignedIn ? (
            <>
              {/* 已登入用戶資訊 */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-fdt-gold/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-fdt-gold" />
                  </div>
                )}
                <div>
                  <p className="font-bold">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</p>
                  <p className="text-sm text-muted">已登入</p>
                </div>
              </div>

              {/* 綁定按鈕 */}
              <button
                onClick={handleBind}
                disabled={binding}
                className="w-full py-4 rounded-xl font-bold btn-gold flex items-center justify-center gap-2"
              >
                {binding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    綁定中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    立即綁定
                  </>
                )}
              </button>

              <p className="text-xs text-muted text-center mt-4">
                綁定後，您將成為 <span className={role.color}>{role.label}</span>
              </p>
            </>
          ) : (
            <>
              {/* 未登入 */}
              <div className="text-center mb-6">
                <LogIn className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted">請先登入以綁定卡片</p>
              </div>

              <SignInButton mode="modal">
                <button className="w-full py-4 rounded-xl font-bold btn-gold flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  登入 / 註冊
                </button>
              </SignInButton>
            </>
          )}
        </div>

        {/* 頁尾 */}
        <p className="text-center text-xs text-muted mt-8">
          © 2024 FDT Black Card. All rights reserved.
        </p>
      </div>
    </div>
  )
}

// 使用 Suspense 包裹以處理 useSearchParams
export default function BindPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-fdt-gold animate-spin" />
        </div>
      }
    >
      <BindPageContent />
    </Suspense>
  )
}

