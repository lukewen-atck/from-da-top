import { NextResponse } from "next/server";
import { validateSession } from "@/lib/session";
import { syncFollowedArtists } from "@/lib/spotify";

export async function POST() {
  try {
    // 驗證使用者是否已登入
    const user = await validateSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 同步追蹤的藝人
    const result = await syncFollowedArtists(user.id);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[Sync Artists] Error:", error);

    // 處理特定錯誤
    if (error instanceof Error) {
      if (error.message === "SPOTIFY_NOT_CONNECTED") {
        return NextResponse.json(
          { error: "Spotify not connected", code: "SPOTIFY_NOT_CONNECTED" },
          { status: 400 }
        );
      }

      if (error.message === "SPOTIFY_TOKEN_EXPIRED") {
        return NextResponse.json(
          { error: "Spotify token expired, please reconnect", code: "SPOTIFY_TOKEN_EXPIRED" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({ error: "Failed to sync artists" }, { status: 500 });
  }
}

