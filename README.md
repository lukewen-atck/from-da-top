# 索尼金曲回憶殺 2000-2010 🎵

一個 Y2K 復古風格的互動式抽歌應用，讓使用者透過 NFC 卡片體驗「命運轉盤」抽選經典歌曲。

## 功能特色

- 🎰 **隨機抽選**：從 100 首 2000-2010 年代金曲中隨機抽選
- 💿 **CD 轉盤動畫**：復古 CD 旋轉 + iPod 風格顯示
- 🔐 **NFC 身分驗證**：每個 UUID 只能抽取一次
- ⚡ **額外機會機制**：完成互動挑戰解鎖第二次機會
- 🖥️ **Y2K 美學**：Windows 95 視窗風格、霓虹光效、掃描線

## 快速開始

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置生產版本
npm run build
```

## URL 參數

使用 `uid` 參數模擬 NFC 卡片識別：

```
http://localhost:5173/?uid=user_12345
```

## 技術棧

- React 18
- Vite 5
- Tailwind CSS 3
- LocalStorage (資料持久化)

## 專案結構

```
src/
├── App.jsx              # 主應用組件
├── main.jsx             # 入口點
├── index.css            # 全域樣式 + Y2K 特效
├── data/
│   └── songs.js         # 100 首歌曲資料庫
├── hooks/
│   └── useUserState.js  # 使用者狀態管理
└── components/
    ├── CDPlayer.jsx     # CD 播放器 + iPod 動畫
    ├── ResultCard.jsx   # 抽選結果卡片
    ├── RetryModal.jsx   # 重抽解鎖彈窗
    └── Win95Window.jsx  # Windows 95 風格組件
```

## 資料結構

### 歌曲資料
```javascript
{
  id: 1,
  title: '唯一',
  artist: '王力宏',
  genre: '情歌',
  year: 2001,
  album: '唯一'
}
```

### 使用者資料 (LocalStorage)
```javascript
{
  uid: "user_12345",
  drawnSongId: 5,
  hasUnlockedRetry: false,
  drawCount: 1,
  firstDrawTime: "2024-01-01T00:00:00.000Z",
  lastDrawTime: "2024-01-01T00:00:00.000Z"
}
```

## 部署建議

### Supabase/Firebase 整合（可選）

如需更強大的資料持久化，可以替換 LocalStorage：

```javascript
// Supabase 範例
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 查詢使用者
const { data } = await supabase
  .from('draws')
  .select('*')
  .eq('uid', uid)
  .single()

// 儲存抽選結果
await supabase
  .from('draws')
  .insert({ uid, song_id: songId })
```

## 授權

© 2024 - 僅供活動使用








