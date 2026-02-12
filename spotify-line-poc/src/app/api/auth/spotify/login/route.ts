import { NextResponse } from "next/server";
import { getSession, generateOAuthState, validateSession } from "@/lib/session";
import { getSpotifyAuthUrl } from "@/lib/spotify";

export async function GET() {
  const baseUrl = process.env.APP_BASE_URL!;

  try {
    // 檢查使用者是否已登入
    const user = await validateSession();
    if (!user) {
      return NextResponse.redirect(`${baseUrl}?error=not_logged_in`);
    }

    // 產生 state 用於 CSRF 保護
    const state = generateOAuthState();

    // 存入 session
    const session = await getSession();
    session.spotifyOAuthState = state;
    await session.save();

    // 產生 Spotify 授權 URL
    const authUrl = getSpotifyAuthUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("[Spotify Login] Error:", error);
    return NextResponse.redirect(
      `${baseUrl}/dashboard?error=spotify_login_failed`
    );
  }
}

