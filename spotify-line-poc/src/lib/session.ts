import { getIronSession, SessionOptions, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

// Session data structure
export interface SessionData {
  userId?: string;
  sessionId?: string;
  // OAuth state 用於 CSRF 保護
  oauthState?: string;
  // 暫存 Spotify 連接流程中的 state
  spotifyOAuthState?: string;
}

// Session 設定
const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "fallback-secret-key-at-least-32-characters-long",
  cookieName: "spotify-line-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

// 取得 session
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

// 建立新 session（登入成功後呼叫）
export async function createSession(userId: string): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // 建立 DB session record
  const dbSession = await prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
  });

  // 設定 cookie session
  const session = await getSession();
  session.userId = userId;
  session.sessionId = dbSession.id;
  await session.save();

  return dbSession.id;
}

// 驗證 session 並取得使用者
export async function validateSession() {
  const session = await getSession();

  if (!session.userId || !session.sessionId) {
    return null;
  }

  // 檢查 DB session 是否存在且未過期
  const dbSession = await prisma.session.findUnique({
    where: { id: session.sessionId },
    include: { user: true },
  });

  if (!dbSession || dbSession.expiresAt < new Date()) {
    // Session 過期或不存在，清除 cookie
    session.destroy();
    return null;
  }

  return dbSession.user;
}

// 取得當前使用者（包含 Spotify 連接狀態）
export async function getCurrentUser() {
  const user = await validateSession();
  if (!user) return null;

  const spotifyAccount = await prisma.oAuthAccount.findFirst({
    where: {
      userId: user.id,
      provider: "spotify",
    },
  });

  return {
    ...user,
    spotifyConnected: !!spotifyAccount,
    spotifyTokenExpired: spotifyAccount
      ? spotifyAccount.tokenExpiresAt < new Date()
      : false,
  };
}

// 登出
export async function destroySession(): Promise<void> {
  const session = await getSession();

  if (session.sessionId) {
    // 刪除 DB session
    await prisma.session.delete({
      where: { id: session.sessionId },
    }).catch(() => {
      // 忽略找不到的情況
    });
  }

  session.destroy();
}

// 產生隨機 state 用於 OAuth CSRF 保護
export function generateOAuthState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

