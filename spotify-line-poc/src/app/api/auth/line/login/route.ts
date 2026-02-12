import { NextResponse } from "next/server";
import { getSession, generateOAuthState } from "@/lib/session";
import { getLineAuthUrl } from "@/lib/line";

export async function GET() {
  try {
    // 產生 state 用於 CSRF 保護
    const state = generateOAuthState();

    // 存入 session
    const session = await getSession();
    session.oauthState = state;
    await session.save();

    // 產生 LINE 授權 URL
    const authUrl = getLineAuthUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("[LINE Login] Error:", error);
    return NextResponse.redirect(
      `${process.env.APP_BASE_URL}?error=line_login_failed`
    );
  }
}

