// Spotify OAuth 2.0 工具函式

import { prisma } from "./prisma";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// Spotify OAuth scope
const SPOTIFY_SCOPES = ["user-follow-read"];

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  genres: string[];
  external_urls: { spotify: string };
}

interface SpotifyFollowingResponse {
  artists: {
    items: SpotifyArtist[];
    next: string | null;
    cursors: { after: string | null };
    total: number;
  };
}

// 產生 Spotify 授權 URL
export function getSpotifyAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: SPOTIFY_SCOPES.join(" "),
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    state,
    show_dialog: "true", // 強制顯示授權對話框
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

// 用 authorization code 換取 token
export async function exchangeSpotifyCode(code: string): Promise<SpotifyTokenResponse> {
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[Spotify] Token exchange failed:", error);
    throw new Error(`Spotify token exchange failed: ${response.status}`);
  }

  return response.json();
}

// 用 refresh_token 取得新的 access_token
export async function refreshSpotifyToken(refreshToken: string): Promise<SpotifyTokenResponse> {
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[Spotify] Token refresh failed:", error);
    throw new Error(`Spotify token refresh failed: ${response.status}`);
  }

  return response.json();
}

// 取得有效的 Spotify access token（自動 refresh）
export async function getValidSpotifyToken(userId: string): Promise<string | null> {
  const account = await prisma.oAuthAccount.findFirst({
    where: {
      userId,
      provider: "spotify",
    },
  });

  if (!account) {
    return null;
  }

  // 檢查 token 是否過期（提前 5 分鐘刷新）
  const isExpired = account.tokenExpiresAt < new Date(Date.now() + 5 * 60 * 1000);

  if (!isExpired) {
    return account.accessToken;
  }

  // Token 過期，嘗試 refresh
  if (!account.refreshToken) {
    console.error("[Spotify] No refresh token available");
    return null;
  }

  try {
    const tokenData = await refreshSpotifyToken(account.refreshToken);

    // 更新 DB
    await prisma.oAuthAccount.update({
      where: { id: account.id },
      data: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || account.refreshToken,
        tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        scope: tokenData.scope,
      },
    });

    console.log("[Spotify] Token refreshed successfully");
    return tokenData.access_token;
  } catch (error) {
    console.error("[Spotify] Token refresh failed:", error);
    return null;
  }
}

// 取得使用者追蹤的藝人（處理 pagination）
export async function getFollowedArtists(accessToken: string): Promise<SpotifyArtist[]> {
  const artists: SpotifyArtist[] = [];
  let after: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const params = new URLSearchParams({
      type: "artist",
      limit: "50",
    });

    if (after) {
      params.set("after", after);
    }

    const response = await fetch(`${SPOTIFY_API_BASE}/me/following?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Spotify] Get followed artists failed:", error);

      if (response.status === 401) {
        throw new Error("SPOTIFY_TOKEN_EXPIRED");
      }

      throw new Error(`Spotify API failed: ${response.status}`);
    }

    const data: SpotifyFollowingResponse = await response.json();

    artists.push(...data.artists.items);

    // 處理 pagination
    after = data.artists.cursors?.after || null;
    hasMore = !!after && data.artists.items.length > 0;

    console.log(`[Spotify] Fetched ${data.artists.items.length} artists, total: ${artists.length}`);
  }

  return artists;
}

// Upsert 藝人到資料庫
export async function upsertArtists(artists: SpotifyArtist[]) {
  const results = [];

  for (const artist of artists) {
    const result = await prisma.artist.upsert({
      where: { spotifyArtistId: artist.id },
      update: {
        name: artist.name,
        imageUrl: artist.images[0]?.url || null,
        followersTotal: artist.followers.total,
        genres: artist.genres,
      },
      create: {
        spotifyArtistId: artist.id,
        name: artist.name,
        imageUrl: artist.images[0]?.url || null,
        followersTotal: artist.followers.total,
        genres: artist.genres,
      },
    });
    results.push(result);
  }

  return results;
}

// 同步使用者追蹤的藝人（完整流程）
export async function syncFollowedArtists(userId: string) {
  // 1. 取得有效的 access token
  const accessToken = await getValidSpotifyToken(userId);
  if (!accessToken) {
    throw new Error("SPOTIFY_NOT_CONNECTED");
  }

  // 2. 從 Spotify API 取得追蹤的藝人
  const spotifyArtists = await getFollowedArtists(accessToken);

  if (spotifyArtists.length === 0) {
    return { artists: [], count: 0, message: "No followed artists found" };
  }

  // 3. Upsert 藝人到資料庫
  const dbArtists = await upsertArtists(spotifyArtists);

  // 4. 更新使用者追蹤關係（增量更新，避免重複）
  const existingFollows = await prisma.userFollowArtist.findMany({
    where: { userId },
    select: { artistId: true },
  });
  const existingArtistIds = new Set(existingFollows.map((f) => f.artistId));

  // 找出新的追蹤關係
  const newFollows = dbArtists.filter((a) => !existingArtistIds.has(a.id));

  if (newFollows.length > 0) {
    await prisma.userFollowArtist.createMany({
      data: newFollows.map((artist) => ({
        userId,
        artistId: artist.id,
      })),
      skipDuplicates: true,
    });
  }

  // 5. 取得使用者所有追蹤的藝人（含完整資訊）
  const userArtists = await prisma.userFollowArtist.findMany({
    where: { userId },
    include: { artist: true },
    orderBy: { followedAt: "desc" },
  });

  return {
    artists: userArtists.map((ua) => ua.artist),
    count: userArtists.length,
    newCount: newFollows.length,
    message: `Synced ${spotifyArtists.length} artists, ${newFollows.length} new`,
  };
}

