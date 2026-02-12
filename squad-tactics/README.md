# RZWD:RADIATION

> 輻射區域戰術對抗系統 - 賽博朋克風格的即時 PvP NFC 手機遊戲

## 概述

這是一個真實世界的團隊對戰遊戲，玩家分為不同隊伍（例如：紅隊 vs 藍隊），每個隊伍有 **Occupiers**（佔領者）和 **Snipers**（狙擊手）兩種角色。

### 遊戲機制

- **團隊制**：每位玩家都屬於一個團隊
- **Occupiers（佔領者）**：
  - 透過觸碰 NFC 標籤來佔領據點
  - 佔領據點會為團隊持續產生分數
  - 弱點：背後有 QR Code，可被敵方狙擊手掃描
- **Snipers（狙擊手）**：
  - 每隊只有一位狙擊手
  - 使用相機掃描敵方 Occupier 的 QR Code
  - 掃描成功後，敵人會被干擾（JAMMED）30 秒
  - 狙擊手不能佔領據點，友軍傷害已禁用

## 技術架構

### 前端
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion（動畫效果）

### 後端
- Supabase Auth（認證）
- Supabase Postgres（資料庫）
- Supabase Realtime（即時訂閱）

### 安全性
- NTAG 424 DNA（NFC 驗證）

## 專案結構

```
squad-tactics/
├── app/
│   ├── api/
│   │   └── game/
│   │       ├── capture/     # NFC 佔領 API
│   │       └── snipe/       # 狙擊攻擊 API
│   ├── game/
│   │   ├── page.tsx         # 遊戲主儀表板
│   │   └── snipe/
│   │       └── page.tsx     # 狙擊手掃描頁面
│   ├── globals.css          # 賽博朋克主題樣式
│   ├── layout.tsx
│   └── page.tsx             # 登入頁面
├── components/
│   └── game/
│       ├── GlitchOverlay.tsx  # 被干擾時的特效覆蓋層
│       └── StatusBadge.tsx    # 狀態徽章元件
├── hooks/
│   └── useRealtimeProfile.ts  # 即時個人資料訂閱
├── lib/
│   ├── ntag424.ts             # NTAG 424 驗證工具
│   └── supabase/
│       ├── client.ts          # 客戶端 Supabase
│       └── server.ts          # 伺服器端 Supabase
├── supabase/
│   └── schema.sql             # 資料庫架構
├── types/
│   └── game.ts                # TypeScript 型別定義
└── middleware.ts              # 認證中介軟體
```

## 快速開始

### 1. 安裝依賴

```bash
cd squad-tactics
npm install
```

### 2. 設定環境變數

建立 `.env.local` 檔案：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 設定 Supabase 資料庫

1. 在 Supabase Dashboard 建立新專案
2. 前往 SQL Editor
3. 執行 `supabase/schema.sql` 中的 SQL 腳本
4. 在 Database > Replication 中啟用 Realtime：
   - 加入 `profiles` 表
   - 加入 `outposts` 表
   - 加入 `teams` 表

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

## API 端點

### POST `/api/game/capture`

佔領據點（透過 NFC）

**Request Body:**
```json
{
  "e": "encrypted-ntag-data",
  "c": "cmac-signature"
}
```

**Response:**
```json
{
  "success": true,
  "outpost": { ... },
  "message": "NEXUS-ALPHA CAPTURED!",
  "captured_from": { "name": "BLUE SPECTER", ... }
}
```

### POST `/api/game/snipe`

狙擊攻擊

**Request Body:**
```json
{
  "dorsal_code": "ON-ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "victim": {
    "id": "...",
    "display_name": "Agent007",
    "team": { ... }
  },
  "jam_duration": 30,
  "message": "TARGET ELIMINATED - Agent007 JAMMED for 30s"
}
```

## 資料庫架構

### 表格

- **teams**: 團隊資訊（名稱、顏色、分數）
- **profiles**: 玩家資料（角色、狀態、隊伍）
- **outposts**: 據點（NFC UID、擁有者、分數）
- **combat_logs**: 戰鬥紀錄
- **capture_logs**: 佔領紀錄
- **game_sessions**: 遊戲回合

### 即時訂閱

遊戲使用 Supabase Realtime 來即時更新：
- 當玩家被狙擊時，其設備會立即震動並顯示干擾畫面
- 據點狀態變更會即時反映在所有玩家的儀表板上

## 待實作功能

- [ ] QR Code 即時掃描（使用 `@yudiel/react-qr-scanner`）
- [ ] NTAG 424 DNA 完整驗證
- [ ] 分數計算 Cron Job
- [ ] 管理員後台
- [ ] 遊戲回合管理
- [ ] 戰績排行榜

## 授權

MIT License

