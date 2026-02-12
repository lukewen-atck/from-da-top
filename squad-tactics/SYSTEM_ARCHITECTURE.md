# RZWD:RADIATION - 系統架構文件

> 此文件用於讓 AI 助手（如 Gemini）了解整個專案的架構與脈絡

---

## 📌 專案概述

**RZWD:RADIATION**（輻射區域戰術對抗系統）是一個賽博朋克風格的**即時 PvP NFC 手機遊戲**。

玩家分為不同**陣營（TEAMS）**進行對抗，每個陣營有兩種角色：
- **OCCUPIER（佔領者）**：佔領輻射源
- **SNIPER（狙擊手）**：干擾敵方玩家

### 核心術語
| 舊名稱 | 新名稱 | 說明 |
|--------|--------|------|
| ON AIR | RZWD:RADIATION | 專案品牌名稱 |
| PSI | Hz（赫茲） | 分數單位 |
| Outpost | Emitter（輻射源） | NFC 佔領點 |
| Squad Tactics | RADIATION | 副標題 |

---

## 🎮 遊戲機制

### 角色系統

#### OCCUPIER（佔領者）
- **目標**：觸碰場地中的 NFC 標籤（Emitter）來佔領輻射源
- **獎勵**：佔領的輻射源會為團隊持續產生 Hz 分數
- **弱點**：背後有 QR Code（dorsal_code），可被敵方狙擊手掃描
- **限制**：被干擾（JAMMED）時無法佔領

#### SNIPER（狙擊手）
- **數量**：每隊只有 1 位
- **目標**：使用相機掃描敵方 Occupier 背後的 QR Code
- **效果**：掃描成功後，敵人會被干擾（JAMMED）30 秒
- **限制**：
  - 不能佔領 NFC 點
  - 不能攻擊友軍（Friendly Fire Disabled）

### 狀態系統

```
ACTIVE → 正常狀態，可進行所有操作
JAMMED → 被干擾狀態，無法進行任何操作，持續 30 秒
```

當玩家被 JAMMED：
1. 畫面顯示全螢幕故障特效（Glitch Overlay）
2. 手機震動
3. 倒數計時 30 秒
4. 期間所有操作被禁用

---

## 🏗️ 技術架構

### 技術棧

| 層級 | 技術 |
|------|------|
| 前端框架 | Next.js 15 (App Router) |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS 4 |
| 動畫 | Framer Motion |
| 後端/資料庫 | Supabase (Postgres) |
| 認證 | Supabase Auth |
| 即時通訊 | Supabase Realtime |
| NFC 安全 | NTAG 424 DNA |

### 專案結構

```
squad-tactics/
├── app/                          # Next.js App Router
│   ├── api/game/
│   │   ├── capture/route.ts      # NFC 佔領 API
│   │   └── snipe/route.ts        # 狙擊攻擊 API
│   ├── game/
│   │   ├── page.tsx              # 遊戲主儀表板
│   │   └── snipe/page.tsx        # 狙擊手掃描頁面
│   ├── globals.css               # 賽博朋克主題樣式
│   ├── layout.tsx                # 根佈局
│   └── page.tsx                  # 登入頁面
├── components/game/
│   ├── GlitchOverlay.tsx         # 被干擾時的故障特效
│   └── StatusBadge.tsx           # 角色/狀態徽章
├── hooks/
│   └── useRealtimeProfile.ts     # 即時個人資料訂閱
├── lib/
│   ├── ntag424.ts                # NTAG 424 驗證工具 (Mock)
│   └── supabase/
│       ├── client.ts             # 客戶端 Supabase
│       └── server.ts             # 伺服器端 Supabase
├── supabase/
│   └── schema.sql                # 完整資料庫架構
├── types/
│   └── game.ts                   # TypeScript 型別定義
└── middleware.ts                 # 認證中介軟體
```

---

## 🗄️ 資料庫架構

### 表格結構

#### `teams` - 陣營
```sql
id UUID PRIMARY KEY
name TEXT                    -- 陣營名稱 (e.g., "RED PHANTOM", "BLUE SPECTER")
color_hex TEXT               -- 顏色代碼 (e.g., "#FF2D55")
current_score INTEGER        -- 當前總分 (Hz)
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### `profiles` - 玩家資料
```sql
id UUID PRIMARY KEY          -- 關聯 auth.users
team_id UUID                 -- 所屬陣營
role player_role             -- 'OCCUPIER' | 'SNIPER' | 'ADMIN'
status player_status         -- 'ACTIVE' | 'JAMMED'
jam_expires_at TIMESTAMPTZ   -- 干擾結束時間
dorsal_code TEXT             -- QR Code 內容 (e.g., "RZ-ABC123")
display_name TEXT
avatar_url TEXT
total_captures INTEGER       -- 總佔領次數
total_snipes INTEGER         -- 總狙擊次數
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### `outposts` - 輻射源 (Emitters)
```sql
id UUID PRIMARY KEY
uid TEXT                     -- NTAG 424 UID
name TEXT                    -- 輻射源名稱 (e.g., "EMITTER-α")
location_description TEXT    -- 位置描述
owning_team_id UUID          -- 當前控制的陣營
last_captured_at TIMESTAMPTZ
last_captured_by UUID
hz_per_minute INTEGER        -- 每分鐘產生的 Hz 分數
is_active BOOLEAN
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### `combat_logs` - 戰鬥紀錄
```sql
id UUID PRIMARY KEY
sniper_id UUID               -- 狙擊手
victim_id UUID               -- 受害者
sniper_team_id UUID
victim_team_id UUID
jam_duration_seconds INTEGER -- 干擾持續時間
created_at TIMESTAMPTZ
```

#### `capture_logs` - 佔領紀錄
```sql
id UUID PRIMARY KEY
outpost_id UUID              -- 輻射源
capturer_id UUID             -- 佔領者
team_id UUID                 -- 佔領後的陣營
previous_team_id UUID        -- 佔領前的陣營
created_at TIMESTAMPTZ
```

#### `game_sessions` - 遊戲回合
```sql
id UUID PRIMARY KEY
name TEXT
status game_status           -- 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ENDED'
started_at TIMESTAMPTZ
ended_at TIMESTAMPTZ
duration_minutes INTEGER
winning_team_id UUID
created_at TIMESTAMPTZ
```

### 自動觸發器

1. **`on_auth_user_created`**：新用戶註冊時自動建立 profile
2. **`set_profile_dorsal_code`**：自動生成 dorsal_code（格式：`RZ-XXXXXX`）
3. **`update_updated_at`**：自動更新 updated_at 時間戳

---

## 🔌 API 端點

### POST `/api/game/capture`
佔領輻射源（透過 NFC）

**Request:**
```json
{
  "e": "encrypted-ntag-data",
  "c": "cmac-signature"
}
```

**驗證邏輯:**
1. 驗證 NTAG 424 簽名
2. 檢查玩家狀態：如果 `JAMMED` → 錯誤 `"SIGNAL JAMMED"`
3. 檢查角色：如果 `SNIPER` → 錯誤 `"SNIPERS CANNOT CAPTURE"`
4. 更新輻射源擁有權
5. 記錄佔領日誌

**Response:**
```json
{
  "success": true,
  "outpost": { ... },
  "message": "EMITTER-α CAPTURED!",
  "captured_from": { "name": "BLUE SPECTER", ... }
}
```

### POST `/api/game/snipe`
狙擊攻擊

**Request:**
```json
{
  "dorsal_code": "RZ-ABC123"
}
```

**驗證邏輯:**
1. 確認呼叫者是 `SNIPER`
2. 透過 `dorsal_code` 找到受害者
3. 友軍傷害檢查：同隊 → 錯誤 `"FRIENDLY FIRE"`
4. 免疫檢查：已 `JAMMED` → 忽略
5. 執行攻擊：
   - 設定 `status = 'JAMMED'`
   - 設定 `jam_expires_at = NOW() + 30s`
   - 記錄戰鬥日誌
   - 觸發 Realtime 事件（受害者設備震動）

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

---

## 📡 即時通訊 (Realtime)

使用 Supabase Realtime 訂閱以下表格的變更：

| 表格 | 用途 |
|------|------|
| `profiles` | 監聽自己的狀態變更（被狙擊時立即觸發 UI） |
| `outposts` | 監聽輻射源擁有權變更 |
| `teams` | 監聽團隊分數變更 |

### 客戶端訂閱範例

```typescript
// hooks/useRealtimeProfile.ts
const channel = supabase
  .channel(`profile:${userId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'profiles',
    filter: `id=eq.${userId}`,
  }, handleProfileUpdate)
  .subscribe();
```

當 `status` 變為 `JAMMED`：
1. 觸發手機震動
2. 顯示 GlitchOverlay 全螢幕特效
3. 開始 30 秒倒數

---

## 🎨 UI/UX 設計

### 視覺風格
- **主題**：賽博朋克 / 科幻
- **主色調**：霓虹青 (`#00f0ff`)、洋紅 (`#ff00ff`)、警告紅 (`#ff2d55`)
- **背景**：深黑 (`#0a0a0f`) + 網格效果 + 掃描線動畫

### 核心元件

1. **GlitchOverlay**：被干擾時的全螢幕故障特效
   - 故障文字動畫
   - 掃描線效果
   - 雜訊紋理
   - 圓形倒數計時器

2. **StatusBadge**：顯示玩家角色和狀態
   - 陣營徽章（帶顏色）
   - 角色圖示（SNIPER/OCCUPIER）
   - 狀態指示燈（綠色=ACTIVE，紅色閃爍=JAMMED）

3. **Scanner HUD**：狙擊手瞄準介面
   - 十字準心
   - 角落括號
   - 相機視圖

---

## 🔐 安全機制

### NTAG 424 DNA
- NFC 標籤使用 AES-128 加密
- 每次觸碰產生唯一簽名，防止重放攻擊
- 目前為 Mock 實作，生產環境需完整驗證

### Row Level Security (RLS)
- 所有表格啟用 RLS
- 用戶只能更新自己的 profile
- 只有 ADMIN 可以管理系統設定
- 只有 SNIPER 可以建立 combat_logs
- 只有 OCCUPIER 可以建立 capture_logs

---

## 📦 待實作功能

- [ ] QR Code 即時掃描（整合 `@yudiel/react-qr-scanner`）
- [ ] NTAG 424 DNA 完整驗證
- [ ] 分數計算 Cron Job（每分鐘更新團隊 Hz 分數）
- [ ] 管理員後台
- [ ] 遊戲回合管理
- [ ] 戰績排行榜
- [ ] 音效系統

---

## 🚀 快速開始

### 1. 安裝依賴
```bash
cd squad-tactics
npm install
```

### 2. 設定環境變數
建立 `.env.local`：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### 3. 設定 Supabase
1. 建立專案
2. 在 SQL Editor 執行 `supabase/schema.sql`
3. 在 Database > Replication 啟用 Realtime（profiles, outposts, teams）

### 4. 啟動開發伺服器
```bash
npm run dev
```

---

## 📝 TypeScript 型別

主要型別定義在 `types/game.ts`：

```typescript
type PlayerRole = 'OCCUPIER' | 'SNIPER' | 'ADMIN';
type PlayerStatus = 'ACTIVE' | 'JAMMED';
type GameStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ENDED';

interface Profile {
  id: string;
  team_id: string | null;
  role: PlayerRole;
  status: PlayerStatus;
  jam_expires_at: string | null;
  dorsal_code: string;
  display_name: string | null;
  total_captures: number;
  total_snipes: number;
  team?: Team;
}

interface Outpost {
  id: string;
  uid: string;
  name: string;
  owning_team_id: string | null;
  hz_per_minute: number;  // 使用 Hz 作為分數單位
  is_active: boolean;
  owning_team?: Team;
}
```

---

## 🔄 版本歷史

| 版本 | 日期 | 變更 |
|------|------|------|
| 0.1.0-alpha | 2026-01-25 | 初始架構建立 |
| 0.1.1-alpha | 2026-01-25 | 品牌更名為 RZWD:RADIATION，分數單位改為 Hz |

---

*此文件最後更新：2026-01-25*
