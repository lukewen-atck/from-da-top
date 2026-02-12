import { NextRequest, NextResponse } from "next/server";
import { getSession, validateSession } from "@/lib/session";
import { exchangeSpotifyCode } from "@/lib/spotify";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.APP_BASE_URL!;

  // 處理使用者取消授權
  if (error) {
    console.error("[Spotify Callback] OAuth error:", error);
    return NextResponse.redirect(
      `${baseUrl}/dashboard?error=spotify_auth_cancelled`
    );
  }

  // 驗證必要參數
  if (!code || !state) {
    console.error("[Spotify Callback] Missing code or state");
    return NextResponse.redirect(`${baseUrl}/dashboard?error=missing_params`);
  }

  try {
    // 驗證使用者是否已登入
    const user = await validateSession();
    if (!user) {
      return NextResponse.redirect(`${baseUrl}?error=not_logged_in`);
    }

    // 驗證 state（CSRF 保護）
    const session = await getSession();
    if (session.spotifyOAuthState !== state) {
      console.error("[Spotify Callback] State mismatch");
      return NextResponse.redirect(`${baseUrl}/dashboard?error=invalid_state`);
    }

    // 清除暫存的 state
    session.spotifyOAuthState = undefined;
    await session.save();

    // 用 code 換取 token
    const tokenData = await exchangeSpotifyCode(code);

    // 計算 token 過期時間
    const tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    // Upsert OAuth 帳號
    await prisma.oAuthAccount.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: "spotify",
        },
      },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt,
        scope: tokenData.scope,
      },
      create: {
        userId: user.id,
        provider: "spotify",
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt,
        scope: tokenData.scope,
      },
    });

    console.log(`[Spotify Callback] User connected Spotify: ${user.displayName}`);

    // 導向 dashboard
    return NextResponse.redirect(`${baseUrl}/dashboard?spotify=connected`);
  } catch (err) {
    console.error("[Spotify Callback] Error:", err);
    return NextResponse.redirect(`${baseUrl}/dashboard?error=spotify_connect_failed`);
  }
}

