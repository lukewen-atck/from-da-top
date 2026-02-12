import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Logout] Error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

// 也支援 GET 以便直接連結登出
export async function GET() {
  const baseUrl = process.env.APP_BASE_URL!;

  try {
    await destroySession();
    return NextResponse.redirect(`${baseUrl}?logout=success`);
  } catch (error) {
    console.error("[Logout] Error:", error);
    return NextResponse.redirect(`${baseUrl}?error=logout_failed`);
  }
}

