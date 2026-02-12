import { PrismaClient, MemberRole, CardStatus, MissionType } from '@prisma/client'

const prisma = new PrismaClient()

// ============================================
// 預設卡片資料
// ============================================
// 編號規則：
// - FDT-001 ~ FDT-200：保留給藝人（創始會員）
// - ATCK-001 ~：洋薊團隊
// - VIP-001 ~：VIP 會員
// - MBR-001 ~：一般會員
// ============================================
const cards = [
  // ========================================
  // 藝人專屬黑卡 (FDT-001 ~ FDT-200 保留)
  // ========================================
  {
    uid: 'FDT-FOUNDER-001',
    preAssignedRole: MemberRole.FOUNDER,
    preAssignedMemberNo: 'FDT-001',
    cardName: '黑卡 #001',
    cardDescription: '創始會員專屬黑卡（藝人）',
    batchNo: 'BATCH-2024-ARTIST',
  },
  {
    uid: 'FDT-FOUNDER-002',
    preAssignedRole: MemberRole.FOUNDER,
    preAssignedMemberNo: 'FDT-002',
    cardName: '黑卡 #002',
    cardDescription: '創始會員專屬黑卡（藝人）',
    batchNo: 'BATCH-2024-ARTIST',
  },
  {
    uid: 'FDT-FOUNDER-003',
    preAssignedRole: MemberRole.FOUNDER,
    preAssignedMemberNo: 'FDT-003',
    cardName: '黑卡 #003',
    cardDescription: '創始會員專屬黑卡（藝人）',
    batchNo: 'BATCH-2024-ARTIST',
  },

  // ========================================
  // 洋薊團隊專屬卡 (ATCK 前綴)
  // ========================================
  {
    uid: 'ATCK-TEAM-001',
    preAssignedRole: MemberRole.FOUNDER,
    preAssignedMemberNo: 'ATCK-001',
    cardName: '團隊卡 #001',
    cardDescription: '洋薊團隊專屬卡',
    batchNo: 'BATCH-2024-TEAM',
  },
  {
    uid: 'ATCK-TEAM-002',
    preAssignedRole: MemberRole.FOUNDER,
    preAssignedMemberNo: 'ATCK-002',
    cardName: '團隊卡 #002',
    cardDescription: '洋薊團隊專屬卡',
    batchNo: 'BATCH-2024-TEAM',
  },
  {
    uid: 'ATCK-TEAM-003',
    preAssignedRole: MemberRole.FOUNDER,
    preAssignedMemberNo: 'ATCK-003',
    cardName: '團隊卡 #003',
    cardDescription: '洋薊團隊專屬卡',
    batchNo: 'BATCH-2024-TEAM',
  },

  // ========================================
  // VIP 會員卡
  // ========================================
  {
    uid: 'FDT-VIP-001',
    preAssignedRole: MemberRole.VIP,
    preAssignedMemberNo: 'VIP-001',
    cardName: 'VIP 卡 #001',
    cardDescription: 'VIP 會員專屬卡片',
    batchNo: 'BATCH-2024-VIP',
  },
  {
    uid: 'FDT-VIP-002',
    preAssignedRole: MemberRole.VIP,
    preAssignedMemberNo: 'VIP-002',
    cardName: 'VIP 卡 #002',
    cardDescription: 'VIP 會員專屬卡片',
    batchNo: 'BATCH-2024-VIP',
  },

  // ========================================
  // 一般會員卡
  // ========================================
  {
    uid: 'FDT-MEMBER-001',
    preAssignedRole: MemberRole.MEMBER,
    preAssignedMemberNo: 'MBR-001',
    cardName: '會員卡 #001',
    cardDescription: '一般會員卡片',
    batchNo: 'BATCH-2024-MEMBER',
  },
  {
    uid: 'FDT-MEMBER-002',
    preAssignedRole: MemberRole.MEMBER,
    preAssignedMemberNo: 'MBR-002',
    cardName: '會員卡 #002',
    cardDescription: '一般會員卡片',
    batchNo: 'BATCH-2024-MEMBER',
  },
  {
    uid: 'FDT-MEMBER-003',
    preAssignedRole: MemberRole.MEMBER,
    preAssignedMemberNo: 'MBR-003',
    cardName: '會員卡 #003',
    cardDescription: '一般會員卡片',
    batchNo: 'BATCH-2024-MEMBER',
  },
]

// ============================================
// 預設獎勵資料
// ============================================
const rewards = [
  {
    name: '免費飲品一杯',
    description: '可兌換任意飲品一杯',
    pointsCost: 100,
    requiredRole: null,
    totalQuantity: 50,
  },
  {
    name: 'VIP 專屬周邊',
    description: '限量 FDT 周邊商品',
    pointsCost: 500,
    requiredRole: MemberRole.VIP,
    totalQuantity: 10,
  },
  {
    name: '創始會員限定禮盒',
    description: '獨家創始會員紀念禮盒',
    pointsCost: 1000,
    requiredRole: MemberRole.FOUNDER,
    totalQuantity: 5,
  },
  {
    name: '活動優先入場券',
    description: '下一場活動優先入場資格',
    pointsCost: 200,
    requiredRole: null,
    totalQuantity: 20,
  },
]

// ============================================
// 預設任務資料
// ============================================
const missions = [
  {
    title: '上傳活動照片',
    description: '參加活動後上傳現場照片，經審核通過即可獲得點數',
    type: MissionType.UPLOAD_PROOF,
    points: 50,
    perUserLimit: 3,
  },
  {
    title: '現場簽到',
    description: '活動現場掃描 QR Code 完成簽到',
    type: MissionType.OFFLINE_SCAN,
    points: 30,
    perUserLimit: 1,
  },
  {
    title: '通關密語挑戰',
    description: '輸入正確的通關密語即可獲得點數',
    type: MissionType.SECRET_CODE,
    points: 100,
    secretCode: 'FDTBLACK2024',
    perUserLimit: 1,
  },
  {
    title: '分享社群媒體',
    description: '在社群媒體分享活動資訊，截圖上傳審核',
    type: MissionType.UPLOAD_PROOF,
    points: 30,
    perUserLimit: 1,
  },
]

async function main() {
  console.log('🌱 開始建立種子資料...\n')

  // 清除現有資料 (開發環境使用)
  console.log('🗑️  清除現有資料...')
  await prisma.missionRecord.deleteMany()
  await prisma.mission.deleteMany()
  await prisma.userReward.deleteMany()
  await prisma.pointLedger.deleteMany()
  await prisma.reward.deleteMany()
  await prisma.card.deleteMany()
  await prisma.user.deleteMany()

  // 建立卡片
  console.log('💳 建立 NFC 卡片...')
  for (const card of cards) {
    await prisma.card.create({
      data: {
        ...card,
        status: CardStatus.UNBOUND,
      },
    })
    console.log(`   ✅ ${card.cardName} (${card.uid})`)
  }

  // 建立獎勵
  console.log('\n🎁 建立獎勵項目...')
  for (const reward of rewards) {
    await prisma.reward.create({
      data: reward,
    })
    console.log(`   ✅ ${reward.name} (${reward.pointsCost} 點)`)
  }

  // 建立任務
  console.log('\n🎯 建立任務...')
  for (const mission of missions) {
    await prisma.mission.create({
      data: mission,
    })
    console.log(`   ✅ ${mission.title} (${mission.points} 點)`)
  }

  console.log('\n✨ 種子資料建立完成！')
  console.log(`   - 卡片: ${cards.length} 張`)
  console.log(`   - 獎勵: ${rewards.length} 項`)
  console.log(`   - 任務: ${missions.length} 項`)
}

main()
  .catch((e) => {
    console.error('❌ 種子資料建立失敗:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

