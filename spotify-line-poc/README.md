# Spotify LINE POC

LINE Login + Spotify OAuth 整合 POC，可同步使用者追蹤的 Spotify 藝人清單。

## 功能

- ✅ LINE Login 社群登入
- ✅ Spotify OAuth 2.0 授權
- ✅ 同步追蹤的藝人（含分頁處理）
- ✅ 藝人資料 upsert（避免重複）
- ✅ Token 自動刷新機制
- ✅ CSRF 保護（state 驗證）
- ✅ 完整錯誤處理

## 技術架構

- **前端**：Next.js 15 (App Router) + React 19 + Tailwind CSS
- **後端**：Next.js Route Handlers
- **資料庫**：PostgreSQL + Prisma ORM
- **Session**：iron-session (signed cookie + DB session)
- **OAuth**：LINE Login + Spotify Authorization Code Flow

## 專案結構

```
spotify-line-poc/
├── prisma/
│   └── schema.prisma          # Prisma 資料模型
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── line/
│   │   │   │   │   ├── login/route.ts      # LINE 登入
│   │   │   │   │   └── callback/route.ts   # LINE callback
│   │   │   │   ├── spotify/
│   │   │   │   │   ├── login/route.ts      # Spotify 連接
│   │   │   │   │   └── callback/route.ts   # Spotify callback
│   │   │   │   └── logout/route.ts         # 登出
│   │   │   ├── me/route.ts                 # 取得當前使用者
│   │   │   └── spotify/
│   │   │       └── sync-followed-artists/route.ts  # 同步藝人
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Dashboard 頁面
│   │   ├── globals.css         # 全域樣式
│   │   ├── layout.tsx          # 根 Layout
│   │   └── page.tsx            # 首頁
│   └── lib/
│       ├── line.ts             # LINE API 工具
│       ├── prisma.ts           # Prisma client
│       ├── session.ts          # Session 管理
│       └── spotify.ts          # Spotify API 工具
├── .env.example                # 環境變數範本
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 資料模型

```
User (使用者)
├── id: uuid
├── lineUserId: string (unique)
├── displayName: string
├── pictureUrl: string?
├── createdAt / updatedAt
│
├── → OAuthAccount (1:N)
├── → UserFollowArtist (1:N)
└── → Session (1:N)

OAuthAccount (OAuth 帳號，用於 Spotify)
├── id: uuid
├── userId: fk
├── provider: "spotify"
├── accessToken / refreshToken
├── tokenExpiresAt
└── scope

Artist (藝人)
├── id: uuid
├── spotifyArtistId: string (unique)
├── name
├── imageUrl
├── followersTotal
└── genres: string[]

UserFollowArtist (追蹤關聯)
├── userId: fk
├── artistId: fk
└── followedAt
```

## 本地啟動步驟

### 1. 安裝依賴

```bash
cd spotify-line-poc
npm install
```

### 2. 設定環境變數

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入以下資訊：

### 3. 設定 LINE Developers Console

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 建立或選擇一個 **Provider**
3. 建立 **LINE Login** Channel
4. 在 Channel 設定中：
   - **Callback URL** 填入：`http://localhost:3000/api/auth/line/callback`
5. 複製 **Channel ID** 和 **Channel Secret** 到 `.env`

### 4. 設定 Spotify Developer Dashboard

1. 前往 [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. 建立新 App
3. 在 App Settings 中：
   - **Redirect URIs** 新增：`http://localhost:3000/api/auth/spotify/callback`
4. 複製 **Client ID** 和 **Client Secret** 到 `.env`

### 5. 設定資料庫

確保 PostgreSQL 已啟動，然後：

```bash
# 產生 Prisma client
npm run db:generate

# 建立資料表（開發用 push）
npm run db:push

# 或使用 migration（正式用）
# npm run db:migrate
```

### 6. 產生 Session Secret

```bash
openssl rand -base64 32
```

將產生的字串填入 `.env` 的 `SESSION_SECRET`

### 7. 啟動開發伺服器

```bash
npm run dev
```

開啟 http://localhost:3000

## 環境變數說明

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| DATABASE_URL | PostgreSQL 連線字串 | postgresql://user:pass@localhost:5432/dbname |
| APP_BASE_URL | 應用程式 base URL | http://localhost:3000 |
| SESSION_SECRET | Session 加密金鑰（至少 32 字元） | openssl rand -base64 32 |
| LINE_CHANNEL_ID | LINE Login Channel ID | 1234567890 |
| LINE_CHANNEL_SECRET | LINE Login Channel Secret | abc123... |
| LINE_REDIRECT_URI | LINE callback URL | http://localhost:3000/api/auth/line/callback |
| SPOTIFY_CLIENT_ID | Spotify App Client ID | abc123... |
| SPOTIFY_CLIENT_SECRET | Spotify App Client Secret | xyz789... |
| SPOTIFY_REDIRECT_URI | Spotify callback URL | http://localhost:3000/api/auth/spotify/callback |

## API 路由

| 方法 | 路徑 | 說明 |
|-----|------|------|
| GET | /api/auth/line/login | 發起 LINE 登入 |
| GET | /api/auth/line/callback | LINE OAuth callback |
| GET | /api/auth/spotify/login | 發起 Spotify 連接 |
| GET | /api/auth/spotify/callback | Spotify OAuth callback |
| GET/POST | /api/auth/logout | 登出 |
| GET | /api/me | 取得當前使用者資料 + 追蹤藝人 |
| POST | /api/spotify/sync-followed-artists | 同步追蹤的藝人 |

## 手動測試 Checklist

### 基本流程

- [ ] 首頁顯示 LINE 登入按鈕
- [ ] 點擊 LINE 登入 → 導向 LINE 授權頁
- [ ] LINE 授權成功 → 導向 Dashboard
- [ ] Dashboard 顯示使用者 LINE profile
- [ ] 顯示 Spotify 未連接狀態

### Spotify 連接

- [ ] 點擊「連接 Spotify」→ 導向 Spotify 授權頁
- [ ] Spotify 授權成功 → 導回 Dashboard
- [ ] 顯示 Spotify 已連接狀態
- [ ] 顯示「同步追蹤藝人」按鈕

### 同步藝人

- [ ] 點擊「同步追蹤藝人」
- [ ] 顯示 loading 狀態
- [ ] 同步完成後顯示藝人卡片
- [ ] 藝人卡片顯示：名稱、圖片、粉絲數、genres

### 增量更新

- [ ] 再次點擊同步 → 不重複新增藝人
- [ ] 藝人資料有更新時會更新 DB

### 錯誤處理

- [ ] LINE 授權取消 → 顯示錯誤訊息
- [ ] Spotify 授權取消 → 顯示錯誤訊息
- [ ] 未連接 Spotify 時同步 → 顯示錯誤
- [ ] Token 過期時 → 自動 refresh 或提示重連

### 登出

- [ ] 點擊登出 → 導回首頁
- [ ] 清除 session

## 安全注意事項

1. **Client Secret 不暴露**：所有 OAuth token 交換都在 server-side 完成
2. **Token 存放**：access_token 和 refresh_token 存在 DB，不放 localStorage
3. **CSRF 保護**：OAuth callback 驗證 state 參數
4. **Session 安全**：使用 iron-session 加密 cookie，HttpOnly + SameSite

## Zeabur 部署

### 1. 準備工作

確保你已經有：
- [Zeabur 帳號](https://zeabur.com)
- LINE Developers Console 已設定好的 Channel
- Spotify Developer Dashboard 已設定好的 App

### 2. 建立專案

1. 登入 Zeabur Dashboard
2. 點擊「New Project」建立新專案
3. 選擇區域（建議選擇離用戶較近的區域）

### 3. 部署 PostgreSQL

1. 在專案中點擊「Add Service」
2. 選擇「Marketplace」→「PostgreSQL」
3. 等待 PostgreSQL 服務啟動完成

### 4. 部署應用程式

1. 點擊「Add Service」→「Git」
2. 連接你的 GitHub/GitLab 帳號
3. 選擇這個 repository
4. Zeabur 會自動偵測為 Next.js 專案

### 5. 設定環境變數

在應用程式服務中，點擊「Variables」標籤，新增以下環境變數：

| 變數名稱 | 值 | 說明 |
|---------|-----|------|
| DATABASE_URL | `${POSTGRES_CONNECTION_STRING}` | 使用 Zeabur 內建變數自動連結 |
| APP_BASE_URL | 你的 Zeabur 網域 | 例如 `https://your-app.zeabur.app` |
| SESSION_SECRET | 隨機字串 | 使用 `openssl rand -base64 32` 產生 |
| LINE_CHANNEL_ID | 你的 LINE Channel ID | 從 LINE Developers Console 取得 |
| LINE_CHANNEL_SECRET | 你的 LINE Channel Secret | 從 LINE Developers Console 取得 |
| LINE_REDIRECT_URI | `${APP_BASE_URL}/api/auth/line/callback` | 記得也要在 LINE Console 設定 |
| SPOTIFY_CLIENT_ID | 你的 Spotify Client ID | 從 Spotify Dashboard 取得 |
| SPOTIFY_CLIENT_SECRET | 你的 Spotify Client Secret | 從 Spotify Dashboard 取得 |
| SPOTIFY_REDIRECT_URI | `${APP_BASE_URL}/api/auth/spotify/callback` | 記得也要在 Spotify Dashboard 設定 |

### 6. 設定網域

1. 點擊應用程式服務
2. 在「Domains」標籤新增網域
3. 可以使用 Zeabur 提供的 `.zeabur.app` 子網域
4. 或綁定自訂網域

### 7. 更新 OAuth Redirect URI

部署完成後，記得更新：

**LINE Developers Console：**
- Callback URL: `https://your-domain.zeabur.app/api/auth/line/callback`

**Spotify Developer Dashboard：**
- Redirect URIs: `https://your-domain.zeabur.app/api/auth/spotify/callback`

### 8. 執行資料庫 Migration

Zeabur 會在部署時自動執行 `prisma generate`，但你需要執行 migration：

方法一：使用 Zeabur Console
1. 在應用程式服務中點擊「Console」
2. 執行 `npx prisma db push`

方法二：修改 package.json 的 build script
```json
{
  "scripts": {
    "build": "prisma generate && prisma db push && next build"
  }
}
```

### Zeabur 環境變數範本

```bash
# 資料庫（使用 Zeabur 內建變數）
DATABASE_URL=${POSTGRES_CONNECTION_STRING}

# 應用程式 URL（部署後取得）
APP_BASE_URL=https://your-app.zeabur.app

# Session（請自行產生）
SESSION_SECRET=your-super-secret-session-key

# LINE Login
LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret
LINE_REDIRECT_URI=https://your-app.zeabur.app/api/auth/line/callback

# Spotify
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_REDIRECT_URI=https://your-app.zeabur.app/api/auth/spotify/callback
```

---

## 常見問題

### Q: LINE Login 失敗，顯示 invalid_redirect_uri

確認 LINE Developers Console 的 Callback URL 設定正確，包含完整路徑：
`http://localhost:3000/api/auth/line/callback`

### Q: Spotify 連接失敗，顯示 INVALID_CLIENT

確認 Spotify Developer Dashboard 的：
1. Redirect URI 設定正確
2. Client ID 和 Client Secret 複製正確

### Q: 同步藝人時顯示 Token expired

點擊「重新連接 Spotify」重新授權

### Q: 資料庫連線失敗

確認：
1. PostgreSQL 服務已啟動
2. DATABASE_URL 格式正確
3. 資料庫已建立

## License

MIT

