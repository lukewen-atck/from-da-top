'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Crown, 
  Star, 
  User, 
  Coins, 
  Gift, 
  History, 
  LogOut, 
  Loader2,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Sparkles,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  Target,
  Upload,
  QrCode,
  Key,
  AlertCircle,
  Send
} from 'lucide-react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

// ============================================
// 類型定義
// ============================================

interface MemberData {
  id: string
  name: string | null
  email: string | null
  avatarUrl: string | null
  memberRole: 'FOUNDER' | 'VIP' | 'MEMBER' | 'GUEST'
  memberNo: string | null
  totalPoints: number
  currentPoints: number
  card: {
    uid: string
    cardName: string | null
    cardDescription: string | null
    boundAt: string
    batchNo: string | null
  } | null
  recentPoints: {
    id: string
    type: string
    amount: number
    balance: number
    description: string | null
    createdAt: string
  }[]
  recentRewards: {
    id: string
    pointsSpent: number
    claimedAt: string
    reward: {
      id: string
      name: string
      imageUrl: string | null
      pointsCost: number
    }
  }[]
  createdAt: string
}

interface RewardItem {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  pointsCost: number
  requiredRole: string | null
  remainingQuantity: number | null
  canClaim: boolean
  isLimited: boolean
}

interface Mission {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  type: 'UPLOAD_PROOF' | 'OFFLINE_SCAN' | 'SECRET_CODE'
  points: number
  startAt: string | null
  endAt: string | null
  perUserLimit: number
  userCompletedCount: number
  userPendingCount: number
  canComplete: boolean
  hasPending: boolean
  globalLimitReached: boolean
}

// ============================================
// 角色配置
// ============================================

const roleConfig = {
  FOUNDER: {
    label: '創始會員',
    color: 'text-fdt-gold',
    bgColor: 'bg-fdt-gold/10',
    borderColor: 'border-fdt-gold/30',
    icon: Crown,
    gradient: 'from-fdt-gold to-amber-600',
    cardBg: 'from-fdt-gold/20 via-amber-900/20 to-fdt-dark',
  },
  VIP: {
    label: 'VIP 會員',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    icon: Star,
    gradient: 'from-purple-400 to-purple-600',
    cardBg: 'from-purple-500/20 via-purple-900/20 to-fdt-dark',
  },
  MEMBER: {
    label: '一般會員',
    color: 'text-fdt-silver',
    bgColor: 'bg-fdt-silver/10',
    borderColor: 'border-fdt-silver/30',
    icon: User,
    gradient: 'from-fdt-silver to-gray-400',
    cardBg: 'from-fdt-silver/20 via-gray-800/20 to-fdt-dark',
  },
  GUEST: {
    label: '訪客',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/30',
    icon: User,
    gradient: 'from-gray-400 to-gray-600',
    cardBg: 'from-gray-500/20 via-gray-800/20 to-fdt-dark',
  },
}

// 點數類型配置
const pointTypeConfig: Record<string, { label: string; color: string; icon: typeof TrendingUp }> = {
  EARN: { label: '獲得', color: 'text-green-400', icon: TrendingUp },
  BONUS: { label: '贈點', color: 'text-fdt-gold', icon: Sparkles },
  REDEEM: { label: '兌換', color: 'text-red-400', icon: TrendingDown },
  EXPIRE: { label: '過期', color: 'text-gray-400', icon: Clock },
  ADJUST: { label: '調整', color: 'text-blue-400', icon: TrendingUp },
}

// 任務類型配置
const missionTypeConfig = {
  UPLOAD_PROOF: { label: '上傳證明', icon: Upload, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  OFFLINE_SCAN: { label: '線下掃碼', icon: QrCode, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  SECRET_CODE: { label: '通關密語', icon: Key, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
}

// ============================================
// 會員中心頁面
// ============================================

export default function MemberPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const { signOut } = useClerk()

  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'points' | 'rewards' | 'missions'>('overview')
  
  // 兌換相關狀態
  const [claimingRewardId, setClaimingRewardId] = useState<string | null>(null)
  const [claimMessage, setClaimMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // 任務相關狀態
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [missionInput, setMissionInput] = useState('')
  const [submittingMission, setSubmittingMission] = useState(false)
  const [missionMessage, setMissionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // 載入會員資料
  async function fetchData() {
    if (!isSignedIn) return

    try {
      const [memberRes, rewardsRes, missionsRes] = await Promise.all([
        fetch('/api/member'),
        fetch('/api/rewards'),
        fetch('/api/missions'),
      ])

      const memberJson = await memberRes.json()
      const rewardsJson = await rewardsRes.json()
      const missionsJson = await missionsRes.json()

      if (memberJson.success) {
        setMemberData(memberJson.data)
      } else if (memberJson.code === 'NO_MEMBERSHIP') {
        setError('NO_MEMBERSHIP')
      } else {
        setError(memberJson.message)
      }

      if (rewardsJson.success) {
        setRewards(rewardsJson.data)
      }

      if (missionsJson.missions) {
        setMissions(missionsJson.missions)
      }
    } catch {
      setError('無法載入資料')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded) {
      fetchData()
    }
  }, [isSignedIn, isLoaded])

  // 兌換獎勵
  async function handleClaimReward(rewardId: string) {
    if (claimingRewardId) return

    setClaimingRewardId(rewardId)
    setClaimMessage(null)

    try {
      const res = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      })

      const data = await res.json()

      if (data.success) {
        setClaimMessage({ type: 'success', text: `${data.message} 剩餘 ${data.data.remainingPoints} 點` })
        // 重新載入資料
        fetchData()
      } else {
        setClaimMessage({ type: 'error', text: data.message })
      }
    } catch {
      setClaimMessage({ type: 'error', text: '系統錯誤，請稍後再試' })
    } finally {
      setClaimingRewardId(null)
    }
  }

  // 處理檔案選擇
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // 檢查檔案類型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setMissionMessage({ type: 'error', text: '只支援 JPG、PNG、GIF、WebP 格式' })
      return
    }

    // 檢查檔案大小 (最大 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setMissionMessage({ type: 'error', text: '檔案大小不能超過 5MB' })
      return
    }

    setUploadedFile(file)
    setUploadedPreview(URL.createObjectURL(file))
    setMissionMessage(null)
  }

  // 提交任務
  async function handleSubmitMission() {
    if (!selectedMission || submittingMission) return

    setSubmittingMission(true)
    setMissionMessage(null)

    try {
      const body: Record<string, string> = { missionId: selectedMission.id }

      if (selectedMission.type === 'UPLOAD_PROOF') {
        // 如果有上傳檔案，先上傳
        if (uploadedFile) {
          setUploading(true)
          const formData = new FormData()
          formData.append('file', uploadedFile)

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          const uploadData = await uploadRes.json()

          if (!uploadData.success) {
            setMissionMessage({ type: 'error', text: uploadData.error || '上傳失敗' })
            setSubmittingMission(false)
            setUploading(false)
            return
          }

          body.proofUrl = uploadData.url
          setUploading(false)
        } else if (missionInput) {
          // 如果沒有上傳檔案，使用輸入的網址
          body.proofUrl = missionInput
        } else {
          setMissionMessage({ type: 'error', text: '請上傳圖片或輸入圖片網址' })
          setSubmittingMission(false)
          return
        }
      } else if (selectedMission.type === 'SECRET_CODE') {
        if (!missionInput) {
          setMissionMessage({ type: 'error', text: '請輸入通關密語' })
          setSubmittingMission(false)
          return
        }
        body.secretCode = missionInput
      }

      const res = await fetch('/api/missions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (data.success) {
        setMissionMessage({ type: 'success', text: data.message })
        setMissionInput('')
        setUploadedFile(null)
        setUploadedPreview(null)
        setSelectedMission(null)
        // 重新載入資料
        fetchData()
      } else {
        setMissionMessage({ type: 'error', text: data.error || '提交失敗' })
      }
    } catch {
      setMissionMessage({ type: 'error', text: '系統錯誤，請稍後再試' })
    } finally {
      setSubmittingMission(false)
      setUploading(false)
    }
  }

  // 載入中
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-fdt-gold animate-spin mx-auto mb-4" />
          <p className="text-muted">載入中...</p>
        </div>
      </div>
    )
  }

  // 未登入
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <CreditCard className="w-16 h-16 text-muted mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">請先登入</h1>
          <p className="text-muted mb-6">登入後即可查看會員資訊</p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-xl font-bold btn-gold"
          >
            前往登入
          </a>
        </div>
      </div>
    )
  }

  // 尚未綁定會員卡
  if (error === 'NO_MEMBERSHIP') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <CreditCard className="w-16 h-16 text-fdt-gold mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">尚未綁定會員卡</h1>
          <p className="text-muted mb-6">掃描 NFC 卡片以成為會員</p>
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => signOut()}
              className="px-6 py-3 bg-card border border-border rounded-xl hover:bg-card-hover transition-colors"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 錯誤
  if (error || !memberData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <CreditCard className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">載入失敗</h1>
          <p className="text-muted mb-6">{error || '發生未知錯誤'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-card border border-border rounded-xl hover:bg-card-hover transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    )
  }

  const role = roleConfig[memberData.memberRole]
  const RoleIcon = role.icon

  return (
    <div className="min-h-screen pb-24">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-fdt-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <img 
            src="/logo.png" 
            alt="FROM DA TOP" 
            className="h-8"
          />
          <button
            onClick={() => signOut()}
            className="p-2 text-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 relative z-10">
        {/* 會員卡片 */}
        <div className={`aspect-[1.586/1] rounded-2xl bg-gradient-to-br ${role.cardBg} border ${role.borderColor} p-6 relative overflow-hidden mb-6 card-glow`}>
          {/* 光效 */}
          <div className="absolute inset-0 shimmer opacity-50" />
          
          {/* 卡片內容 */}
          <div className="relative h-full flex flex-col justify-between">
            {/* 上方 */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted uppercase tracking-widest mb-1">FDT BLACK CARD</p>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center`}>
                    <RoleIcon className="w-4 h-4 text-fdt-black" />
                  </div>
                  <span className={`font-bold ${role.color}`}>{role.label}</span>
                </div>
              </div>
              {user?.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border-2 border-border"
                />
              )}
            </div>

            {/* 下方 */}
            <div>
              <div className="mb-4">
                <p className="text-xs text-muted mb-1">會員編號</p>
                <p className="text-2xl font-mono font-bold tracking-wider">{memberData.memberNo}</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-muted mb-1">會員姓名</p>
                  <p className="font-bold">{memberData.name || user?.fullName || '未設定'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted mb-1">綁定日期</p>
                  <p className="text-sm">
                    {memberData.card?.boundAt 
                      ? format(new Date(memberData.card.boundAt), 'yyyy/MM/dd', { locale: zhTW })
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 點數概覽 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted mb-2">
              <Coins className="w-4 h-4" />
              <span className="text-sm">目前點數</span>
            </div>
            <p className="text-3xl font-bold text-fdt-gold">{memberData.currentPoints.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">累計獲得</span>
            </div>
            <p className="text-3xl font-bold">{memberData.totalPoints.toLocaleString()}</p>
          </div>
        </div>

        {/* Tab 切換 */}
        <div className="flex bg-card border border-border rounded-xl p-1 mb-6">
          {[
            { key: 'overview', label: '總覽', icon: CreditCard },
            { key: 'missions', label: '任務', icon: Target },
            { key: 'points', label: '點數', icon: History },
            { key: 'rewards', label: '獎勵', icon: Gift },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-fdt-gold text-fdt-black'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 內容 */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* 卡片資訊 */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-fdt-gold" />
                卡片資訊
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">卡片名稱</span>
                  <span>{memberData.card?.cardName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">卡片描述</span>
                  <span>{memberData.card?.cardDescription || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">批次編號</span>
                  <span className="font-mono">{memberData.card?.batchNo || '-'}</span>
                </div>
              </div>
            </div>

            {/* 快速操作 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <h3 className="font-bold p-4 border-b border-border flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-fdt-gold" />
                快速操作
              </h3>
              <button 
                onClick={() => setActiveTab('rewards')}
                className="w-full flex items-center justify-between p-4 hover:bg-card-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fdt-gold/10 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-fdt-gold" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">兌換獎勵</p>
                    <p className="text-sm text-muted">{rewards.filter(r => r.canClaim).length} 項可兌換</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted" />
              </button>
              <button 
                onClick={() => setActiveTab('points')}
                className="w-full flex items-center justify-between p-4 hover:bg-card-hover transition-colors border-t border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <History className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">點數紀錄</p>
                    <p className="text-sm text-muted">查看完整紀錄</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="space-y-4">
            {/* 任務訊息 */}
            {missionMessage && (
              <div className={`flex items-center gap-2 p-4 rounded-xl ${
                missionMessage.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {missionMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{missionMessage.text}</span>
              </div>
            )}

            {/* 任務提交彈窗 */}
            {selectedMission && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{selectedMission.title}</h3>
                    <button
                      onClick={() => {
                        setSelectedMission(null)
                        setMissionInput('')
                        setMissionMessage(null)
                        setUploadedFile(null)
                        setUploadedPreview(null)
                      }}
                      className="p-2 text-muted hover:text-foreground"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {selectedMission.description && (
                    <p className="text-sm text-muted">{selectedMission.description}</p>
                  )}

                  <div className="flex items-center gap-2 text-fdt-gold">
                    <Coins className="w-4 h-4" />
                    <span className="font-bold">+{selectedMission.points} 點</span>
                  </div>

                  {/* 根據任務類型顯示不同的輸入 */}
                  {selectedMission.type === 'UPLOAD_PROOF' && (
                    <div className="space-y-4">
                      {/* 圖片上傳區域 */}
                      <div>
                        <label className="text-sm text-muted mb-2 block">上傳證明照片</label>
                        
                        {uploadedPreview ? (
                          <div className="relative">
                            <img 
                              src={uploadedPreview} 
                              alt="Preview" 
                              className="w-full max-h-48 object-contain rounded-xl border border-border"
                            />
                            <button
                              onClick={() => {
                                setUploadedFile(null)
                                setUploadedPreview(null)
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 bg-fdt-dark border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-fdt-gold transition-colors">
                            <Upload className="w-8 h-8 text-muted mb-2" />
                            <span className="text-sm text-muted">點擊選擇圖片</span>
                            <span className="text-xs text-muted mt-1">支援 JPG、PNG、GIF、WebP（最大 5MB）</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* 或使用網址 */}
                      <div className="relative">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
                          <div className="flex-1 border-t border-border"></div>
                          <span className="px-3 text-xs text-muted bg-card">或輸入圖片網址</span>
                          <div className="flex-1 border-t border-border"></div>
                        </div>
                      </div>

                      <input
                        type="url"
                        placeholder="https://..."
                        value={missionInput}
                        onChange={(e) => setMissionInput(e.target.value)}
                        disabled={!!uploadedFile}
                        className="w-full px-4 py-3 bg-fdt-dark border border-border rounded-xl focus:outline-none focus:border-fdt-gold disabled:opacity-50"
                      />
                    </div>
                  )}

                  {selectedMission.type === 'SECRET_CODE' && (
                    <div>
                      <label className="text-sm text-muted mb-2 block">輸入通關密語</label>
                      <input
                        type="text"
                        placeholder="請輸入通關密語"
                        value={missionInput}
                        onChange={(e) => setMissionInput(e.target.value)}
                        className="w-full px-4 py-3 bg-fdt-dark border border-border rounded-xl focus:outline-none focus:border-fdt-gold text-center text-lg font-mono tracking-widest"
                      />
                    </div>
                  )}

                  {selectedMission.type === 'OFFLINE_SCAN' && (
                    <div className="bg-fdt-dark rounded-xl p-4 text-center">
                      <QrCode className="w-12 h-12 mx-auto mb-2 text-muted" />
                      <p className="text-sm text-muted">請前往活動現場掃描 QR Code</p>
                    </div>
                  )}

                  {missionMessage && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      missionMessage.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {missionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span className="text-sm">{missionMessage.text}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSubmitMission}
                    disabled={submittingMission || uploading}
                    className="w-full flex items-center justify-center gap-2 py-3 btn-gold rounded-xl font-bold disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        上傳圖片中...
                      </>
                    ) : submittingMission ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        提交任務
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 任務列表 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <h3 className="font-bold p-4 border-b border-border flex items-center gap-2">
                <Target className="w-5 h-5 text-fdt-gold" />
                可執行任務
              </h3>
              {missions.length === 0 ? (
                <div className="p-8 text-center text-muted">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>目前沒有可執行的任務</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {missions.map((mission) => {
                    const typeInfo = missionTypeConfig[mission.type]
                    const TypeIcon = typeInfo.icon

                    return (
                      <div key={mission.id} className="p-4">
                        <div className="flex gap-4">
                          {/* 任務圖標 */}
                          <div className={`w-14 h-14 rounded-xl ${typeInfo.bgColor} flex items-center justify-center shrink-0`}>
                            {mission.imageUrl ? (
                              <img src={mission.imageUrl} alt={mission.title} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <TypeIcon className={`w-7 h-7 ${typeInfo.color}`} />
                            )}
                          </div>

                          {/* 任務資訊 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold">{mission.title}</h4>
                                  <span className={`text-xs px-2 py-0.5 rounded ${typeInfo.bgColor} ${typeInfo.color}`}>
                                    {typeInfo.label}
                                  </span>
                                </div>
                                {mission.description && (
                                  <p className="text-sm text-muted mt-1 line-clamp-2">{mission.description}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-3">
                                <span className="text-fdt-gold font-bold">+{mission.points} 點</span>
                                {mission.userCompletedCount > 0 && (
                                  <span className="text-xs text-green-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    已完成 {mission.userCompletedCount}/{mission.perUserLimit}
                                  </span>
                                )}
                                {mission.hasPending && (
                                  <span className="text-xs text-yellow-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    審核中
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  if (mission.canComplete) {
                                    setSelectedMission(mission)
                                    setMissionInput('')
                                    setMissionMessage(null)
                                  }
                                }}
                                disabled={!mission.canComplete}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                  mission.canComplete
                                    ? 'btn-gold'
                                    : 'bg-border text-muted cursor-not-allowed'
                                }`}
                              >
                                {mission.hasPending ? '審核中' : 
                                 mission.globalLimitReached ? '已額滿' :
                                 mission.userCompletedCount >= mission.perUserLimit ? '已完成' : '執行'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'points' && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <h3 className="font-bold p-4 border-b border-border flex items-center gap-2">
                <History className="w-5 h-5 text-fdt-gold" />
                點數紀錄
              </h3>
              {memberData.recentPoints.length === 0 ? (
                <div className="p-8 text-center text-muted">
                  <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>尚無點數紀錄</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {memberData.recentPoints.map((record) => {
                    const typeInfo = pointTypeConfig[record.type] || pointTypeConfig.ADJUST
                    const TypeIcon = typeInfo.icon
                    const isPositive = record.amount > 0

                    return (
                      <div key={record.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${isPositive ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                            <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                          </div>
                          <div>
                            <p className="font-medium">{record.description || typeInfo.label}</p>
                            <p className="text-sm text-muted">
                              {format(new Date(record.createdAt), 'MM/dd HH:mm', { locale: zhTW })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}{record.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted">餘額 {record.balance.toLocaleString()}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-4">
            {/* 兌換訊息 */}
            {claimMessage && (
              <div className={`flex items-center gap-2 p-4 rounded-xl ${
                claimMessage.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {claimMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{claimMessage.text}</span>
              </div>
            )}

            {/* 可兌換獎勵 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <h3 className="font-bold p-4 border-b border-border flex items-center gap-2">
                <Gift className="w-5 h-5 text-fdt-gold" />
                可兌換獎勵
              </h3>
              {rewards.length === 0 ? (
                <div className="p-8 text-center text-muted">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>目前沒有可兌換的獎勵</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {rewards.map((reward) => {
                    const canClaimNow = reward.canClaim && memberData.currentPoints >= reward.pointsCost
                    const isClaiming = claimingRewardId === reward.id

                    return (
                      <div key={reward.id} className="p-4">
                        <div className="flex gap-4">
                          {/* 獎勵圖片 */}
                          <div className="w-20 h-20 rounded-lg bg-fdt-dark flex items-center justify-center shrink-0">
                            {reward.imageUrl ? (
                              <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Gift className="w-8 h-8 text-muted" />
                            )}
                          </div>

                          {/* 獎勵資訊 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold">{reward.name}</h4>
                                {reward.description && (
                                  <p className="text-sm text-muted mt-1 line-clamp-2">{reward.description}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <span className="text-fdt-gold font-bold">{reward.pointsCost.toLocaleString()} 點</span>
                                {reward.isLimited && (
                                  <span className="text-xs text-muted">
                                    剩餘 {reward.remainingQuantity}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => canClaimNow && handleClaimReward(reward.id)}
                                disabled={!canClaimNow || isClaiming}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                                  canClaimNow && !isClaiming
                                    ? 'btn-gold'
                                    : 'bg-border text-muted cursor-not-allowed'
                                }`}
                              >
                                {isClaiming ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    兌換中
                                  </>
                                ) : !reward.canClaim ? (
                                  '無法兌換'
                                ) : memberData.currentPoints < reward.pointsCost ? (
                                  '點數不足'
                                ) : (
                                  '兌換'
                                )}
                              </button>
                            </div>

                            {/* 會員等級要求 */}
                            {reward.requiredRole && (
                              <p className="text-xs text-muted mt-2">
                                限 {roleConfig[reward.requiredRole as keyof typeof roleConfig]?.label || reward.requiredRole} 以上
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 已兌換獎勵 */}
            {memberData.recentRewards.length > 0 && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <h3 className="font-bold p-4 border-b border-border flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  已兌換獎勵
                </h3>
                <div className="divide-y divide-border">
                  {memberData.recentRewards.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-fdt-dark flex items-center justify-center">
                          {item.reward.imageUrl ? (
                            <img src={item.reward.imageUrl} alt={item.reward.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Gift className="w-6 h-6 text-muted" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.reward.name}</p>
                          <p className="text-sm text-muted">
                            {format(new Date(item.claimedAt), 'yyyy/MM/dd', { locale: zhTW })}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted">-{item.pointsSpent} 點</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

