import { NextRequest, NextResponse } from "next/server";
import { getSession, createSession } from "@/lib/session";
import { exchangeLineCode, getLineProfile } from "@/lib/line";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = process.env.APP_BASE_URL!;

  // 處理使用者取消授權
  if (error) {
    console.error("[LINE Callback] OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      `${baseUrl}?error=line_auth_cancelled&message=${encodeURIComponent(errorDescription || "授權已取消")}`
    );
  }

  // 驗證必要參數
  if (!code || !state) {
    console.error("[LINE Callback] Missing code or state");
    return NextResponse.redirect(`${baseUrl}?error=missing_params`);
  }

  try {
    // 驗證 state（CSRF 保護）
    const session = await getSession();
    if (session.oauthState !== state) {
      console.error("[LINE Callback] State mismatch");
      return NextResponse.redirect(`${baseUrl}?error=invalid_state`);
    }

    // 清除暫存的 state
    session.oauthState = undefined;
    await session.save();

    // 用 code 換取 token
    const tokenData = await exchangeLineCode(code);

    // 取得使用者 profile
    const profile = await getLineProfile(tokenData.access_token);

    // Upsert 使用者
    const user = await prisma.user.upsert({
      where: { lineUserId: profile.userId },
      update: {
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
      },
      create: {
        lineUserId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
      },
    });

    // 建立 session
    await createSession(user.id);

    console.log(`[LINE Callback] User logged in: ${user.displayName} (${user.id})`);

    // 導向 dashboard
    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (err) {
    console.error("[LINE Callback] Error:", err);
    return NextResponse.redirect(`${baseUrl}?error=login_failed`);
  }
}

