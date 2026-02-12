'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Coins, 
  Gift, 
  Crown, 
  Star, 
  User,
  Loader2,
  Plus,
  Minus,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Package,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Save,
  CreditCard,
  Link,
  Check,
  Target,
  Upload,
  QrCode,
  Key,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Image,
  ExternalLink
} from 'lucide-react'

// ============================================
// 類型定義
// ============================================

interface Member {
  id: string
  clerkId: string
  email: string | null
  name: string | null
  memberRole: 'FOUNDER' | 'VIP' | 'MEMBER' | 'GUEST'
  memberNo: string | null
  totalPoints: number
  currentPoints: number
  card: {
    uid: string
    cardName: string | null
    status: string
  } | null
  createdAt: string
}

interface Reward {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  pointsCost: number
  requiredRole: 'FOUNDER' | 'VIP' | 'MEMBER' | null
  totalQuantity: number | null
  claimedQuantity: number
  status: 'AVAILABLE' | 'DISABLED' | 'EXPIRED' | 'CLAIMED'
  startAt: string | null
  endAt: string | null
  _count: { claimedBy: number }
}

interface Card {
  id: string
  uid: string
  preAssignedRole: 'FOUNDER' | 'VIP' | 'MEMBER' | 'GUEST'
  preAssignedMemberNo: string
  cardName: string | null
  cardDescription: string | null
  status: 'UNBOUND' | 'BOUND' | 'DISABLED'
  batchNo: string | null
  user: {
    id: string
    name: string | null
    email: string | null
    memberNo: string | null
  } | null
  createdAt: string
}

interface Mission {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  type: 'UPLOAD_PROOF' | 'OFFLINE_SCAN' | 'SECRET_CODE'
  points: number
  secretCode: string | null
  startAt: string | null
  endAt: string | null
  isActive: boolean
  maxCompletions: number | null
  perUserLimit: number
  _count: { records: number }
  records: MissionRecord[]
}

interface MissionRecord {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  proofUrl: string | null
  proofNote: string | null
  rejectionReason: string | null
  pointsAwarded: number | null
  createdAt: string
  user: {
    id: string
    memberNo: string | null
    name: string | null
    email: string | null
  }
  mission: {
    id: string
    title: string
    points: number
  }
}

// 任務類型配置
const missionTypeConfig = {
  UPLOAD_PROOF: { label: '上傳證明', icon: Upload, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  OFFLINE_SCAN: { label: '線下掃碼', icon: QrCode, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  SECRET_CODE: { label: '通關密語', icon: Key, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
}

// 角色配置
const roleConfig = {
  FOUNDER: { label: '創始會員', color: 'text-fdt-gold', icon: Crown },
  VIP: { label: 'VIP', color: 'text-purple-400', icon: Star },
  MEMBER: { label: '會員', color: 'text-fdt-silver', icon: User },
  GUEST: { label: '訪客', color: 'text-gray-400', icon: User },
}

export default function AdminPage() {
  // Tab 狀態
  const [activeTab, setActiveTab] = useState<'members' | 'cards' | 'rewards' | 'missions'>('members')
  
  // 會員相關
  const [members, setMembers] = useState<Member[]>([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [pointAmount, setPointAmount] = useState('')
  const [pointType, setPointType] = useState<'BONUS' | 'ADJUST'>('BONUS')
  const [pointDescription, setPointDescription] = useState('')
  const [submittingPoints, setSubmittingPoints] = useState(false)
  const [pointMessage, setPointMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // 修改會員編號相關
  const [editingMemberNo, setEditingMemberNo] = useState(false)
  const [newMemberNo, setNewMemberNo] = useState('')
  const [submittingMemberNo, setSubmittingMemberNo] = useState(false)
  const [memberNoMessage, setMemberNoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // 卡片相關
  const [cards, setCards] = useState<Card[]>([])
  const [loadingCards, setLoadingCards] = useState(true)
  const [cardSearchTerm, setCardSearchTerm] = useState('')
  const [cardForm, setCardForm] = useState({
    uid: '',
    preAssignedRole: 'MEMBER' as 'FOUNDER' | 'VIP' | 'MEMBER',
    preAssignedMemberNo: '',
    cardName: '',
    cardDescription: '',
    batchNo: '',
  })
  const [submittingCard, setSubmittingCard] = useState(false)
  const [cardMessage, setCardMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [copiedUid, setCopiedUid] = useState<string | null>(null)

  // 獎勵相關
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loadingRewards, setLoadingRewards] = useState(true)
  const [showRewardForm, setShowRewardForm] = useState(false)
  const [rewardForm, setRewardForm] = useState({
    name: '',
    description: '',
    pointsCost: '',
    requiredRole: '' as '' | 'FOUNDER' | 'VIP' | 'MEMBER',
    totalQuantity: '',
  })
  const [submittingReward, setSubmittingReward] = useState(false)
  const [rewardMessage, setRewardMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // 任務相關
  const [missions, setMissions] = useState<Mission[]>([])
  const [pendingRecords, setPendingRecords] = useState<MissionRecord[]>([])
  const [loadingMissions, setLoadingMissions] = useState(true)
  const [missionForm, setMissionForm] = useState({
    title: '',
    description: '',
    type: 'UPLOAD_PROOF' as 'UPLOAD_PROOF' | 'OFFLINE_SCAN' | 'SECRET_CODE',
    points: '',
    secretCode: '',
    perUserLimit: '1',
    maxCompletions: '',
  })
  const [submittingMission, setSubmittingMission] = useState(false)
  const [missionMessage, setMissionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<MissionRecord | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [reviewingRecord, setReviewingRecord] = useState(false)
  const [missionImageFile, setMissionImageFile] = useState<File | null>(null)
  const [missionImagePreview, setMissionImagePreview] = useState<string | null>(null)
  const [uploadingMissionImage, setUploadingMissionImage] = useState(false)

  // 載入會員列表
  async function fetchMembers() {
    setLoadingMembers(true)
    try {
      const res = await fetch('/api/admin/members')
      const data = await res.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch members:', error)
    } finally {
      setLoadingMembers(false)
    }
  }

  // 載入獎勵列表
  async function fetchRewards() {
    setLoadingRewards(true)
    try {
      const res = await fetch('/api/admin/rewards')
      const data = await res.json()
      if (data.success) {
        setRewards(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch rewards:', error)
    } finally {
      setLoadingRewards(false)
    }
  }

  // 載入卡片列表
  async function fetchCards() {
    setLoadingCards(true)
    try {
      const res = await fetch('/api/admin/cards')
      const data = await res.json()
      if (data.success) {
        setCards(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error)
    } finally {
      setLoadingCards(false)
    }
  }

  // 載入任務列表
  async function fetchMissions() {
    setLoadingMissions(true)
    try {
      const res = await fetch('/api/admin/missions?includeRecords=true&pendingOnly=true')
      const data = await res.json()
      if (data.missions) {
        setMissions(data.missions)
        // 提取所有待審核紀錄
        const pending: MissionRecord[] = []
        data.missions.forEach((m: Mission) => {
          if (m.records) {
            m.records.forEach((r) => {
              if (r.status === 'PENDING') {
                pending.push({ ...r, mission: { id: m.id, title: m.title, points: m.points } })
              }
            })
          }
        })
        setPendingRecords(pending)
      }
    } catch (error) {
      console.error('Failed to fetch missions:', error)
    } finally {
      setLoadingMissions(false)
    }
  }

  useEffect(() => {
    fetchMembers()
    fetchRewards()
    fetchCards()
    fetchMissions()
  }, [])

  // 新增卡片
  async function handleCreateCard() {
    if (!cardForm.uid || !cardForm.preAssignedMemberNo) {
      setCardMessage({ type: 'error', text: '請填寫 UID 和會員編號' })
      return
    }

    setSubmittingCard(true)
    setCardMessage(null)

    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: cardForm.uid.toUpperCase(),
          preAssignedRole: cardForm.preAssignedRole,
          preAssignedMemberNo: cardForm.preAssignedMemberNo.toUpperCase(),
          cardName: cardForm.cardName || undefined,
          cardDescription: cardForm.cardDescription || undefined,
          batchNo: cardForm.batchNo || undefined,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setCardMessage({ type: 'success', text: '卡片建立成功' })
        fetchCards()
        setCardForm({
          uid: '',
          preAssignedRole: 'MEMBER',
          preAssignedMemberNo: '',
          cardName: '',
          cardDescription: '',
          batchNo: '',
        })
      } else {
        setCardMessage({ type: 'error', text: data.message })
      }
    } catch {
      setCardMessage({ type: 'error', text: '系統錯誤' })
    } finally {
      setSubmittingCard(false)
    }
  }

  // 切換卡片狀態
  async function handleToggleCardStatus(card: Card) {
    const newStatus = card.status === 'DISABLED' ? 'UNBOUND' : 'DISABLED'
    
    try {
      const res = await fetch('/api/admin/cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: card.id, status: newStatus }),
      })

      const data = await res.json()
      if (data.success) {
        setCards(prev => prev.map(c => 
          c.id === card.id ? { ...c, status: newStatus } : c
        ))
      }
    } catch (error) {
      console.error('Failed to toggle card status:', error)
    }
  }

  // 刪除卡片
  async function handleDeleteCard(cardId: string) {
    if (!confirm('確定要刪除此卡片嗎？')) return

    try {
      const res = await fetch(`/api/admin/cards?id=${cardId}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success) {
        setCards(prev => prev.filter(c => c.id !== cardId))
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Failed to delete card:', error)
    }
  }

  // 複製連結
  function copyBindLink(uid: string) {
    const link = `https://fdt-black-card.vercel.app/bind?uid=${uid}`
    navigator.clipboard.writeText(link)
    setCopiedUid(uid)
    setTimeout(() => setCopiedUid(null), 2000)
  }

  // 處理任務圖片選擇
  function handleMissionImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      setMissionMessage({ type: 'error', text: '只支援 JPG、PNG、GIF、WebP、SVG 格式' })
      return
    }

    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      setMissionMessage({ type: 'error', text: '檔案大小不能超過 2MB' })
      return
    }

    setMissionImageFile(file)
    setMissionImagePreview(URL.createObjectURL(file))
    setMissionMessage(null)
  }

  // 新增任務
  async function handleCreateMission() {
    if (!missionForm.title || !missionForm.points) {
      setMissionMessage({ type: 'error', text: '請填寫任務名稱和點數' })
      return
    }

    if (missionForm.type === 'SECRET_CODE' && !missionForm.secretCode) {
      setMissionMessage({ type: 'error', text: '請設定通關密語' })
      return
    }

    setSubmittingMission(true)
    setMissionMessage(null)

    try {
      let imageUrl: string | undefined

      // 如果有選擇圖片，先上傳
      if (missionImageFile) {
        setUploadingMissionImage(true)
        const formData = new FormData()
        formData.append('file', missionImageFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const uploadData = await uploadRes.json()
        setUploadingMissionImage(false)

        if (!uploadData.success) {
          setMissionMessage({ type: 'error', text: uploadData.error || '圖片上傳失敗' })
          setSubmittingMission(false)
          return
        }

        imageUrl = uploadData.url
      }

      const res = await fetch('/api/admin/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: missionForm.title,
          description: missionForm.description || undefined,
          imageUrl,
          type: missionForm.type,
          points: parseInt(missionForm.points),
          secretCode: missionForm.type === 'SECRET_CODE' ? missionForm.secretCode : undefined,
          perUserLimit: parseInt(missionForm.perUserLimit) || 1,
          maxCompletions: missionForm.maxCompletions ? parseInt(missionForm.maxCompletions) : undefined,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setMissionMessage({ type: 'success', text: '任務建立成功' })
        fetchMissions()
        setMissionForm({
          title: '',
          description: '',
          type: 'UPLOAD_PROOF',
          points: '',
          secretCode: '',
          perUserLimit: '1',
          maxCompletions: '',
        })
        setMissionImageFile(null)
        setMissionImagePreview(null)
      } else {
        setMissionMessage({ type: 'error', text: data.error || '建立失敗' })
      }
    } catch {
      setMissionMessage({ type: 'error', text: '系統錯誤' })
    } finally {
      setSubmittingMission(false)
    }
  }

  // 切換任務狀態
  async function handleToggleMissionStatus(mission: Mission) {
    try {
      const res = await fetch('/api/admin/missions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: mission.id, isActive: !mission.isActive }),
      })

      const data = await res.json()
      if (data.success) {
        setMissions(prev => prev.map(m => 
          m.id === mission.id ? { ...m, isActive: !m.isActive } : m
        ))
      }
    } catch (error) {
      console.error('Failed to toggle mission status:', error)
    }
  }

  // 刪除任務
  async function handleDeleteMission(missionId: string) {
    if (!confirm('確定要刪除此任務嗎？')) return

    try {
      const res = await fetch(`/api/admin/missions?id=${missionId}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success) {
        fetchMissions()
      } else {
        alert(data.message || data.error)
      }
    } catch (error) {
      console.error('Failed to delete mission:', error)
    }
  }

  // 審核任務
  async function handleReviewRecord(action: 'APPROVE' | 'REJECT') {
    if (!selectedRecord) return
    
    if (action === 'REJECT' && !rejectReason.trim()) {
      alert('請輸入拒絕原因')
      return
    }

    setReviewingRecord(true)

    try {
      const res = await fetch('/api/admin/missions/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordId: selectedRecord.id,
          action,
          reason: action === 'REJECT' ? rejectReason : undefined,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSelectedRecord(null)
        setRejectReason('')
        fetchMissions()
        fetchMembers() // 更新會員點數
      } else {
        alert(data.error || '審核失敗')
      }
    } catch (error) {
      console.error('Failed to review record:', error)
    } finally {
      setReviewingRecord(false)
    }
  }

  // 發放點數
  async function handleAddPoints(isPositive: boolean) {
    if (!selectedMember || !pointAmount) return

    const amount = isPositive 
      ? Math.abs(parseInt(pointAmount)) 
      : -Math.abs(parseInt(pointAmount))

    if (isNaN(amount) || amount === 0) {
      setPointMessage({ type: 'error', text: '請輸入有效的點數' })
      return
    }

    setSubmittingPoints(true)
    setPointMessage(null)

    try {
      const res = await fetch('/api/admin/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedMember.id,
          amount,
          type: pointType,
          description: pointDescription || undefined,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setPointMessage({ type: 'success', text: data.message })
        setMembers(prev => prev.map(m => 
          m.id === selectedMember.id 
            ? { ...m, currentPoints: data.data.currentPoints, totalPoints: data.data.totalPoints }
            : m
        ))
        setSelectedMember(prev => prev ? {
          ...prev,
          currentPoints: data.data.currentPoints,
          totalPoints: data.data.totalPoints,
        } : null)
        setPointAmount('')
        setPointDescription('')
      } else {
        setPointMessage({ type: 'error', text: data.message })
      }
    } catch {
      setPointMessage({ type: 'error', text: '系統錯誤' })
    } finally {
      setSubmittingPoints(false)
    }
  }

  // 新增獎勵
  async function handleCreateReward() {
    if (!rewardForm.name || !rewardForm.pointsCost) {
      setRewardMessage({ type: 'error', text: '請填寫獎勵名稱和所需點數' })
      return
    }

    setSubmittingReward(true)
    setRewardMessage(null)

    try {
      const res = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: rewardForm.name,
          description: rewardForm.description || undefined,
          pointsCost: parseInt(rewardForm.pointsCost),
          requiredRole: rewardForm.requiredRole || null,
          totalQuantity: rewardForm.totalQuantity ? parseInt(rewardForm.totalQuantity) : null,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setRewardMessage({ type: 'success', text: data.message })
        fetchRewards()
        setRewardForm({ name: '', description: '', pointsCost: '', requiredRole: '', totalQuantity: '' })
        setShowRewardForm(false)
      } else {
        setRewardMessage({ type: 'error', text: data.message })
      }
    } catch {
      setRewardMessage({ type: 'error', text: '系統錯誤' })
    } finally {
      setSubmittingReward(false)
    }
  }

  // 修改會員編號
  async function handleUpdateMemberNo() {
    if (!selectedMember || !newMemberNo.trim()) {
      setMemberNoMessage({ type: 'error', text: '請輸入會員編號' })
      return
    }

    setSubmittingMemberNo(true)
    setMemberNoMessage(null)

    try {
      const res = await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedMember.id,
          memberNo: newMemberNo.trim(),
        }),
      })

      const data = await res.json()

      if (data.success) {
        setMemberNoMessage({ type: 'success', text: '會員編號已更新' })
        // 更新本地狀態
        setMembers(prev => prev.map(m => 
          m.id === selectedMember.id 
            ? { ...m, memberNo: newMemberNo.trim() }
            : m
        ))
        setSelectedMember(prev => prev ? {
          ...prev,
          memberNo: newMemberNo.trim(),
        } : null)
        setEditingMemberNo(false)
      } else {
        setMemberNoMessage({ type: 'error', text: data.message })
      }
    } catch {
      setMemberNoMessage({ type: 'error', text: '系統錯誤' })
    } finally {
      setSubmittingMemberNo(false)
    }
  }

  // 切換獎勵狀態
  async function handleToggleRewardStatus(reward: Reward) {
    const newStatus = reward.status === 'AVAILABLE' ? 'DISABLED' : 'AVAILABLE'
    
    try {
      const res = await fetch('/api/admin/rewards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reward.id, status: newStatus }),
      })

      const data = await res.json()
      if (data.success) {
        setRewards(prev => prev.map(r => 
          r.id === reward.id ? { ...r, status: newStatus } : r
        ))
      }
    } catch (error) {
      console.error('Failed to toggle reward status:', error)
    }
  }

  // 刪除獎勵
  async function handleDeleteReward(rewardId: string) {
    if (!confirm('確定要刪除此獎勵嗎？')) return

    try {
      const res = await fetch(`/api/admin/rewards?id=${rewardId}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success) {
        setRewards(prev => prev.filter(r => r.id !== rewardId))
      }
    } catch (error) {
      console.error('Failed to delete reward:', error)
    }
  }

  // 過濾會員
  const filteredMembers = members.filter(m => 
    m.memberNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="FROM DA TOP" 
            className="h-8"
          />
          <span className="text-muted">後台管理</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-fdt-gold/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-fdt-gold" />
              </div>
              <div>
                <p className="text-sm text-muted">總會員數</p>
                <p className="text-2xl font-bold">{members.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Coins className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted">總發放點數</p>
                <p className="text-2xl font-bold">
                  {members.reduce((sum, m) => sum + m.totalPoints, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Coins className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted">流通點數</p>
                <p className="text-2xl font-bold">
                  {members.reduce((sum, m) => sum + m.currentPoints, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Gift className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted">上架獎勵</p>
                <p className="text-2xl font-bold">
                  {rewards.filter(r => r.status === 'AVAILABLE').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 切換 */}
        <div className="flex bg-card border border-border rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'members'
                ? 'bg-fdt-gold text-fdt-black'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4" />
            會員管理
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'cards'
                ? 'bg-fdt-gold text-fdt-black'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            卡片管理
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'rewards'
                ? 'bg-fdt-gold text-fdt-black'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Gift className="w-4 h-4" />
            獎勵管理
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'missions'
                ? 'bg-fdt-gold text-fdt-black'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Target className="w-4 h-4" />
            任務管理
            {pendingRecords.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {pendingRecords.length}
              </span>
            )}
          </button>
        </div>

        {/* 會員管理 Tab */}
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 會員列表 */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between gap-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-fdt-gold" />
                  會員列表
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      placeholder="搜尋會員..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-fdt-gold"
                    />
                  </div>
                  <button
                    onClick={fetchMembers}
                    className="p-2 bg-background border border-border rounded-lg hover:bg-card-hover transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingMembers ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {loadingMembers ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-fdt-gold" />
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-8 text-center text-muted">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>尚無會員</p>
                </div>
              ) : (
                <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                  {filteredMembers.map((member) => {
                    const role = roleConfig[member.memberRole]
                    const RoleIcon = role.icon
                    const isSelected = selectedMember?.id === member.id

                    return (
                      <button
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className={`w-full p-4 flex items-center justify-between hover:bg-card-hover transition-colors text-left ${
                          isSelected ? 'bg-fdt-gold/10' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-fdt-dark flex items-center justify-center`}>
                            <RoleIcon className={`w-5 h-5 ${role.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{member.memberNo}</span>
                              <span className={`text-xs ${role.color}`}>{role.label}</span>
                            </div>
                            <p className="text-sm text-muted">
                              {member.name || member.email || '未設定'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-fdt-gold">{member.currentPoints.toLocaleString()}</p>
                          <p className="text-xs text-muted">點數</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 發點面板 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-bold flex items-center gap-2">
                  <Coins className="w-5 h-5 text-fdt-gold" />
                  點數操作
                </h2>
              </div>

              {selectedMember ? (
                <div className="p-4 space-y-4">
                  <div className="bg-fdt-dark rounded-lg p-4">
                    <p className="text-sm text-muted mb-1">選擇的會員</p>
                    
                    {/* 會員編號（可編輯） */}
                    {editingMemberNo ? (
                      <div className="space-y-2 mb-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newMemberNo}
                            onChange={(e) => setNewMemberNo(e.target.value.toUpperCase())}
                            placeholder="輸入會員編號"
                            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-fdt-gold font-bold"
                          />
                          <button
                            onClick={handleUpdateMemberNo}
                            disabled={submittingMemberNo}
                            className="p-2 bg-fdt-gold text-fdt-black rounded-lg hover:bg-fdt-gold/80 transition-colors disabled:opacity-50"
                          >
                            {submittingMemberNo ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingMemberNo(false)
                              setNewMemberNo('')
                              setMemberNoMessage(null)
                            }}
                            className="p-2 bg-border rounded-lg hover:bg-card-hover transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                        {/* 編號規則提示 */}
                        <div className="text-xs text-muted bg-background/50 rounded p-2 space-y-0.5">
                          <p className="text-fdt-gold font-medium mb-1">編號規則：</p>
                          <p>• FDT-001~200：藝人專屬</p>
                          <p>• ATCK-XXX：洋薊團隊</p>
                          <p>• VIP-XXX：VIP 會員</p>
                          <p>• MBR-XXX：一般會員</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-lg">{selectedMember.memberNo}</p>
                        <button
                          onClick={() => {
                            setEditingMemberNo(true)
                            setNewMemberNo(selectedMember.memberNo || '')
                            setMemberNoMessage(null)
                          }}
                          className="p-1 text-muted hover:text-fdt-gold transition-colors"
                          title="修改會員編號"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* 會員編號訊息 */}
                    {memberNoMessage && (
                      <div className={`text-xs mb-2 ${memberNoMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {memberNoMessage.text}
                      </div>
                    )}
                    
                    <p className="text-sm text-muted">{selectedMember.name || selectedMember.email}</p>
                    <div className="mt-3 pt-3 border-t border-border flex justify-between">
                      <div>
                        <p className="text-xs text-muted">目前點數</p>
                        <p className="font-bold text-fdt-gold">{selectedMember.currentPoints.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted">累計獲得</p>
                        <p className="font-bold">{selectedMember.totalPoints.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted mb-2 block">類型</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPointType('BONUS')}
                        className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                          pointType === 'BONUS'
                            ? 'bg-fdt-gold text-fdt-black'
                            : 'bg-fdt-dark hover:bg-border'
                        }`}
                      >
                        贈點
                      </button>
                      <button
                        onClick={() => setPointType('ADJUST')}
                        className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                          pointType === 'ADJUST'
                            ? 'bg-fdt-gold text-fdt-black'
                            : 'bg-fdt-dark hover:bg-border'
                        }`}
                      >
                        調整
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted mb-2 block">點數</label>
                    <input
                      type="number"
                      placeholder="輸入點數"
                      value={pointAmount}
                      onChange={(e) => setPointAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-center text-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted mb-2 block">備註（選填）</label>
                    <input
                      type="text"
                      placeholder="例如：活動獎勵"
                      value={pointDescription}
                      onChange={(e) => setPointDescription(e.target.value)}
                      className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                    />
                  </div>

                  {pointMessage && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      pointMessage.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {pointMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      <span className="text-sm">{pointMessage.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAddPoints(true)}
                      disabled={submittingPoints || !pointAmount}
                      className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-500 disabled:bg-border disabled:cursor-not-allowed rounded-lg font-bold transition-colors"
                    >
                      {submittingPoints ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" />發放</>}
                    </button>
                    <button
                      onClick={() => handleAddPoints(false)}
                      disabled={submittingPoints || !pointAmount}
                      className="flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 disabled:bg-border disabled:cursor-not-allowed rounded-lg font-bold transition-colors"
                    >
                      {submittingPoints ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Minus className="w-5 h-5" />扣除</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-muted">
                  <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>請從左側選擇會員</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 卡片管理 Tab */}
        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 卡片列表 */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between gap-4">
                <h2 className="font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-fdt-gold" />
                  NFC 卡片列表
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      placeholder="搜尋卡片..."
                      value={cardSearchTerm}
                      onChange={(e) => setCardSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-fdt-gold"
                    />
                  </div>
                  <button
                    onClick={fetchCards}
                    className="p-2 bg-background border border-border rounded-lg hover:bg-card-hover transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingCards ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {loadingCards ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-fdt-gold" />
                </div>
              ) : cards.length === 0 ? (
                <div className="p-8 text-center text-muted">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>尚無卡片，請在右側新增</p>
                </div>
              ) : (
                <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                  {cards
                    .filter(c => 
                      c.uid.toLowerCase().includes(cardSearchTerm.toLowerCase()) ||
                      c.preAssignedMemberNo.toLowerCase().includes(cardSearchTerm.toLowerCase()) ||
                      c.cardName?.toLowerCase().includes(cardSearchTerm.toLowerCase())
                    )
                    .map((card) => {
                      const role = roleConfig[card.preAssignedRole]
                      const RoleIcon = role.icon
                      const statusConfig = {
                        UNBOUND: { label: '未綁定', color: 'bg-blue-500/20 text-blue-400' },
                        BOUND: { label: '已綁定', color: 'bg-green-500/20 text-green-400' },
                        DISABLED: { label: '已停用', color: 'bg-red-500/20 text-red-400' },
                      }
                      const status = statusConfig[card.status]

                      return (
                        <div key={card.id} className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-4">
                              <div className="w-12 h-12 rounded-lg bg-fdt-dark flex items-center justify-center shrink-0">
                                <RoleIcon className={`w-6 h-6 ${role.color}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold">{card.preAssignedMemberNo}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded ${role.color} bg-fdt-dark`}>
                                    {role.label}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded ${status.color}`}>
                                    {status.label}
                                  </span>
                                </div>
                                <p className="text-sm text-muted mt-1">
                                  UID: <code className="bg-fdt-dark px-1.5 py-0.5 rounded">{card.uid}</code>
                                </p>
                                {card.cardName && (
                                  <p className="text-sm text-muted">{card.cardName}</p>
                                )}
                                {card.user && (
                                  <p className="text-xs text-green-400 mt-1">
                                    綁定：{card.user.name || card.user.email}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* 複製連結 */}
                              <button
                                onClick={() => copyBindLink(card.uid)}
                                className="p-2 bg-fdt-dark rounded-lg hover:bg-border transition-colors"
                                title="複製綁定連結"
                              >
                                {copiedUid === card.uid ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Link className="w-4 h-4 text-muted" />
                                )}
                              </button>
                              {/* 停用/啟用 */}
                              {card.status !== 'BOUND' && (
                                <button
                                  onClick={() => handleToggleCardStatus(card)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    card.status === 'DISABLED'
                                      ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                      : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                                  }`}
                                  title={card.status === 'DISABLED' ? '啟用' : '停用'}
                                >
                                  {card.status === 'DISABLED' ? (
                                    <ToggleLeft className="w-5 h-5" />
                                  ) : (
                                    <ToggleRight className="w-5 h-5" />
                                  )}
                                </button>
                              )}
                              {/* 刪除（只能刪除未綁定） */}
                              {card.status !== 'BOUND' && (
                                <button
                                  onClick={() => handleDeleteCard(card.id)}
                                  className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                  title="刪除"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>

            {/* 新增卡片面板 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-fdt-gold" />
                  新增 NFC 卡片
                </h2>
              </div>

              <div className="p-4 space-y-4">
                {/* 編號規則提示 */}
                <div className="text-xs text-muted bg-fdt-dark rounded-lg p-3 space-y-0.5">
                  <p className="text-fdt-gold font-medium mb-1">📋 編號規則：</p>
                  <p>• <span className="text-fdt-gold">FDT-001~200</span>：藝人專屬</p>
                  <p>• <span className="text-purple-400">ATCK-XXX</span>：洋薊團隊</p>
                  <p>• <span className="text-blue-400">VIP-XXX</span>：VIP 會員</p>
                  <p>• <span className="text-gray-400">MBR-XXX</span>：一般會員</p>
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">卡片 UID *</label>
                  <input
                    type="text"
                    placeholder="例如：FDT-FOUNDER-001"
                    value={cardForm.uid}
                    onChange={(e) => setCardForm(prev => ({ ...prev, uid: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm font-mono"
                  />
                  <p className="text-xs text-muted mt-1">寫入 NFC 的唯一識別碼</p>
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">會員身份 *</label>
                  <select
                    value={cardForm.preAssignedRole}
                    onChange={(e) => setCardForm(prev => ({ ...prev, preAssignedRole: e.target.value as 'FOUNDER' | 'VIP' | 'MEMBER' }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                  >
                    <option value="FOUNDER">創始會員</option>
                    <option value="VIP">VIP</option>
                    <option value="MEMBER">一般會員</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">會員編號 *</label>
                  <input
                    type="text"
                    placeholder="例如：FDT-001"
                    value={cardForm.preAssignedMemberNo}
                    onChange={(e) => setCardForm(prev => ({ ...prev, preAssignedMemberNo: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">卡片名稱（選填）</label>
                  <input
                    type="text"
                    placeholder="例如：黑卡 #001"
                    value={cardForm.cardName}
                    onChange={(e) => setCardForm(prev => ({ ...prev, cardName: e.target.value }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">卡片說明（選填）</label>
                  <input
                    type="text"
                    placeholder="例如：藝人專屬黑卡"
                    value={cardForm.cardDescription}
                    onChange={(e) => setCardForm(prev => ({ ...prev, cardDescription: e.target.value }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">批次編號（選填）</label>
                  <input
                    type="text"
                    placeholder="例如：BATCH-2024-01"
                    value={cardForm.batchNo}
                    onChange={(e) => setCardForm(prev => ({ ...prev, batchNo: e.target.value }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                  />
                </div>

                {cardMessage && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    cardMessage.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {cardMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span className="text-sm">{cardMessage.text}</span>
                  </div>
                )}

                <button
                  onClick={handleCreateCard}
                  disabled={submittingCard || !cardForm.uid || !cardForm.preAssignedMemberNo}
                  className="w-full flex items-center justify-center gap-2 py-3 btn-gold rounded-lg disabled:bg-border disabled:cursor-not-allowed"
                >
                  {submittingCard ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      建立卡片
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 獎勵管理 Tab */}
        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 獎勵列表 */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2">
                  <Gift className="w-5 h-5 text-fdt-gold" />
                  獎勵列表
                </h2>
                <button
                  onClick={fetchRewards}
                  className="p-2 bg-background border border-border rounded-lg hover:bg-card-hover transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingRewards ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {loadingRewards ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-fdt-gold" />
                </div>
              ) : rewards.length === 0 ? (
                <div className="p-8 text-center text-muted">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>尚無獎勵</p>
                </div>
              ) : (
                <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-lg bg-fdt-dark flex items-center justify-center shrink-0">
                            <Gift className="w-8 h-8 text-muted" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold">{reward.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                reward.status === 'AVAILABLE' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {reward.status === 'AVAILABLE' ? '上架中' : '已下架'}
                              </span>
                            </div>
                            {reward.description && (
                              <p className="text-sm text-muted mt-1">{reward.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-fdt-gold font-bold">{reward.pointsCost} 點</span>
                              {reward.requiredRole && (
                                <span className="text-muted">
                                  限 {roleConfig[reward.requiredRole]?.label}
                                </span>
                              )}
                              {reward.totalQuantity && (
                                <span className="text-muted">
                                  庫存 {reward.totalQuantity - reward.claimedQuantity}/{reward.totalQuantity}
                                </span>
                              )}
                              <span className="text-muted">
                                已兌換 {reward._count.claimedBy} 次
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleRewardStatus(reward)}
                            className={`p-2 rounded-lg transition-colors ${
                              reward.status === 'AVAILABLE'
                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            }`}
                            title={reward.status === 'AVAILABLE' ? '下架' : '上架'}
                          >
                            {reward.status === 'AVAILABLE' ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteReward(reward.id)}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                            title="刪除"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 新增獎勵面板 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-fdt-gold" />
                  新增獎勵
                </h2>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm text-muted mb-2 block">獎勵名稱 *</label>
                  <input
                    type="text"
                    placeholder="例如：免費飲品一杯"
                    value={rewardForm.name}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">說明（選填）</label>
                  <input
                    type="text"
                    placeholder="獎勵說明"
                    value={rewardForm.description}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">所需點數 *</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={rewardForm.pointsCost}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, pointsCost: e.target.value }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">會員等級限制</label>
                  <select
                    value={rewardForm.requiredRole}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, requiredRole: e.target.value as '' | 'FOUNDER' | 'VIP' | 'MEMBER' }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                  >
                    <option value="">不限</option>
                    <option value="MEMBER">一般會員以上</option>
                    <option value="VIP">VIP 以上</option>
                    <option value="FOUNDER">創始會員限定</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 block">數量限制（選填）</label>
                  <input
                    type="number"
                    placeholder="不限"
                    value={rewardForm.totalQuantity}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, totalQuantity: e.target.value }))}
                    className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                  />
                </div>

                {rewardMessage && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    rewardMessage.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {rewardMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span className="text-sm">{rewardMessage.text}</span>
                  </div>
                )}

                <button
                  onClick={handleCreateReward}
                  disabled={submittingReward || !rewardForm.name || !rewardForm.pointsCost}
                  className="w-full flex items-center justify-center gap-2 py-3 btn-gold rounded-lg disabled:bg-border disabled:cursor-not-allowed"
                >
                  {submittingReward ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      建立獎勵
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 任務管理 Tab */}
        {activeTab === 'missions' && (
          <div className="space-y-6">
            {/* 待審核任務 */}
            {pendingRecords.length > 0 && (
              <div className="bg-card border border-orange-500/30 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-orange-500/10">
                  <h2 className="font-bold flex items-center gap-2 text-orange-400">
                    <Clock className="w-5 h-5" />
                    待審核任務
                    <span className="ml-2 px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                      {pendingRecords.length}
                    </span>
                  </h2>
                </div>
                <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                  {pendingRecords.map((record) => (
                    <div key={record.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{record.user.memberNo || record.user.email}</span>
                            <span className="text-muted">提交了</span>
                            <span className="text-fdt-gold font-bold">{record.mission.title}</span>
                          </div>
                          <p className="text-xs text-muted mb-2">
                            {new Date(record.createdAt).toLocaleString('zh-TW')}
                          </p>
                          {record.proofUrl && (
                            <a
                              href={record.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-400 hover:underline"
                            >
                              <Image className="w-4 h-4" />
                              查看證明圖片
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {record.proofNote && (
                            <p className="text-sm text-muted mt-1">備註：{record.proofNote}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedRecord(record)}
                            className="px-3 py-2 bg-fdt-dark rounded-lg hover:bg-border transition-colors text-sm flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            審核
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 審核彈窗 */}
            {selectedRecord && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">審核任務提交</h3>
                    <button
                      onClick={() => {
                        setSelectedRecord(null)
                        setRejectReason('')
                      }}
                      className="p-2 text-muted hover:text-foreground"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-fdt-dark rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted">會員</span>
                      <span className="font-bold">{selectedRecord.user.memberNo || selectedRecord.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">任務</span>
                      <span className="font-bold text-fdt-gold">{selectedRecord.mission.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">獎勵點數</span>
                      <span className="font-bold text-green-400">+{selectedRecord.mission.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">提交時間</span>
                      <span>{new Date(selectedRecord.createdAt).toLocaleString('zh-TW')}</span>
                    </div>
                  </div>

                  {selectedRecord.proofUrl && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted">證明圖片：</p>
                      <a
                        href={selectedRecord.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img 
                          src={selectedRecord.proofUrl} 
                          alt="Proof" 
                          className="max-h-48 rounded-lg mx-auto border border-border"
                        />
                      </a>
                    </div>
                  )}

                  {selectedRecord.proofNote && (
                    <div className="bg-fdt-dark rounded-lg p-3">
                      <p className="text-sm text-muted mb-1">用戶備註：</p>
                      <p>{selectedRecord.proofNote}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-muted mb-2 block">拒絕原因（若拒絕請填寫）</label>
                    <input
                      type="text"
                      placeholder="請輸入拒絕原因"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleReviewRecord('REJECT')}
                      disabled={reviewingRecord}
                      className="flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-lg font-bold transition-colors"
                    >
                      {reviewingRecord ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <ThumbsDown className="w-5 h-5" />
                          拒絕
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReviewRecord('APPROVE')}
                      disabled={reviewingRecord}
                      className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg font-bold transition-colors"
                    >
                      {reviewingRecord ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <ThumbsUp className="w-5 h-5" />
                          通過
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 任務列表 */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-fdt-gold" />
                    任務列表
                  </h2>
                  <button
                    onClick={fetchMissions}
                    className="p-2 bg-background border border-border rounded-lg hover:bg-card-hover transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingMissions ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {loadingMissions ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-fdt-gold" />
                  </div>
                ) : missions.length === 0 ? (
                  <div className="p-8 text-center text-muted">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>尚無任務，請在右側新增</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                    {missions.map((mission) => {
                      const typeInfo = missionTypeConfig[mission.type]
                      const TypeIcon = typeInfo.icon

                      return (
                        <div key={mission.id} className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-4">
                              <div className={`w-12 h-12 rounded-lg ${typeInfo.bgColor} flex items-center justify-center shrink-0`}>
                                <TypeIcon className={`w-6 h-6 ${typeInfo.color}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold">{mission.title}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded ${typeInfo.bgColor} ${typeInfo.color}`}>
                                    {typeInfo.label}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    mission.isActive 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {mission.isActive ? '啟用中' : '已停用'}
                                  </span>
                                </div>
                                {mission.description && (
                                  <p className="text-sm text-muted mt-1">{mission.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span className="text-fdt-gold font-bold">+{mission.points} 點</span>
                                  <span className="text-muted">每人 {mission.perUserLimit} 次</span>
                                  <span className="text-muted">完成 {mission._count.records} 次</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleMissionStatus(mission)}
                                className={`p-2 rounded-lg transition-colors ${
                                  mission.isActive
                                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                }`}
                                title={mission.isActive ? '停用' : '啟用'}
                              >
                                {mission.isActive ? (
                                  <ToggleRight className="w-5 h-5" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteMission(mission.id)}
                                className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                title="刪除"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 新增任務面板 */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="font-bold flex items-center gap-2">
                    <Plus className="w-5 h-5 text-fdt-gold" />
                    新增任務
                  </h2>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm text-muted mb-2 block">任務名稱 *</label>
                    <input
                      type="text"
                      placeholder="例如：上傳活動照片"
                      value={missionForm.title}
                      onChange={(e) => setMissionForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted mb-2 block">說明（選填）</label>
                    <input
                      type="text"
                      placeholder="任務說明"
                      value={missionForm.description}
                      onChange={(e) => setMissionForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                    />
                  </div>

                  {/* 任務圖示上傳 */}
                  <div>
                    <label className="text-sm text-muted mb-2 block">任務圖示（選填）</label>
                    {missionImagePreview ? (
                      <div className="relative inline-block">
                        <img 
                          src={missionImagePreview} 
                          alt="Preview" 
                          className="w-20 h-20 object-contain rounded-lg border border-border bg-fdt-dark"
                        />
                        <button
                          onClick={() => {
                            setMissionImageFile(null)
                            setMissionImagePreview(null)
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-20 h-20 bg-fdt-dark border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-fdt-gold transition-colors">
                        <div className="text-center">
                          <Upload className="w-6 h-6 text-muted mx-auto" />
                          <span className="text-xs text-muted mt-1 block">上傳</span>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                          onChange={handleMissionImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                    <p className="text-xs text-muted mt-1">建議 80x80 像素，最大 2MB</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted mb-2 block">任務類型 *</label>
                    <select
                      value={missionForm.type}
                      onChange={(e) => setMissionForm(prev => ({ ...prev, type: e.target.value as typeof missionForm.type }))}
                      className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                    >
                      <option value="UPLOAD_PROOF">上傳證明圖片</option>
                      <option value="OFFLINE_SCAN">線下掃碼</option>
                      <option value="SECRET_CODE">通關密語</option>
                    </select>
                  </div>

                  {missionForm.type === 'SECRET_CODE' && (
                    <div>
                      <label className="text-sm text-muted mb-2 block">通關密語 *</label>
                      <input
                        type="text"
                        placeholder="設定通關密語"
                        value={missionForm.secretCode}
                        onChange={(e) => setMissionForm(prev => ({ ...prev, secretCode: e.target.value }))}
                        className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-muted mb-2 block">獎勵點數 *</label>
                    <input
                      type="number"
                      placeholder="50"
                      value={missionForm.points}
                      onChange={(e) => setMissionForm(prev => ({ ...prev, points: e.target.value }))}
                      className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted mb-2 block">每人次數</label>
                      <input
                        type="number"
                        placeholder="1"
                        value={missionForm.perUserLimit}
                        onChange={(e) => setMissionForm(prev => ({ ...prev, perUserLimit: e.target.value }))}
                        className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted mb-2 block">總次數限制</label>
                      <input
                        type="number"
                        placeholder="不限"
                        value={missionForm.maxCompletions}
                        onChange={(e) => setMissionForm(prev => ({ ...prev, maxCompletions: e.target.value }))}
                        className="w-full px-4 py-2 bg-fdt-dark border border-border rounded-lg focus:outline-none focus:border-fdt-gold text-sm"
                      />
                    </div>
                  </div>

                  {missionMessage && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      missionMessage.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {missionMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      <span className="text-sm">{missionMessage.text}</span>
                    </div>
                  )}

                  <button
                    onClick={handleCreateMission}
                    disabled={submittingMission || uploadingMissionImage || !missionForm.title || !missionForm.points}
                    className="w-full flex items-center justify-center gap-2 py-3 btn-gold rounded-lg disabled:bg-border disabled:cursor-not-allowed"
                  >
                    {uploadingMissionImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        上傳圖片中...
                      </>
                    ) : submittingMission ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        建立中...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        建立任務
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
