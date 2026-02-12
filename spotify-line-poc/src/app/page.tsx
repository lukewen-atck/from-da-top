"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 檢查 URL 參數中的錯誤訊息
    const errorParam = searchParams.get("error");
    const message = searchParams.get("message");

    if (errorParam) {
      setError(message || getErrorMessage(errorParam));
    }

    // 檢查是否已登入
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          // 已登入，導向 dashboard
          router.push("/dashboard");
          return;
        }
      } catch {
        // 未登入，留在首頁
      }
      setChecking(false);
    };

    checkAuth();
  }, [router, searchParams]);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Logo & Title */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Spotify Logo */}
          <svg className="w-12 h-12 text-spotify-green" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span className="text-4xl text-white/30">×</span>
          {/* LINE Logo */}
          <svg className="w-12 h-12 text-line-green" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
          Spotify Artists Sync
        </h1>
        <p className="text-white/60 text-lg max-w-md mx-auto">
          用 LINE 登入，連接 Spotify 帳號，同步你追蹤的藝人清單
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 px-6 py-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 max-w-md text-center">
          {error}
        </div>
      )}

      {/* Login Button */}
      <Link
        href="/api/auth/line/login"
        className="btn btn-line text-lg px-8 py-4 rounded-2xl shadow-lg shadow-line-green/20"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
        </svg>
        用 LINE 登入
      </Link>

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <div className="text-center p-6">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-line-green/20 flex items-center justify-center">
            <span className="text-2xl">1️⃣</span>
          </div>
          <h3 className="font-semibold text-white mb-2">LINE 登入</h3>
          <p className="text-white/50 text-sm">快速安全的社群登入</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-spotify-green/20 flex items-center justify-center">
            <span className="text-2xl">2️⃣</span>
          </div>
          <h3 className="font-semibold text-white mb-2">連接 Spotify</h3>
          <p className="text-white/50 text-sm">授權存取追蹤藝人</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-2xl">3️⃣</span>
          </div>
          <h3 className="font-semibold text-white mb-2">同步藝人</h3>
          <p className="text-white/50 text-sm">查看所有追蹤的藝人</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-white/30 text-sm">
        Spotify LINE POC · Built with Next.js
      </footer>
    </main>
  );
}

function getErrorMessage(errorCode: string): string {
  const messages: Record<string, string> = {
    line_login_failed: "LINE 登入失敗，請重試",
    line_auth_cancelled: "LINE 授權已取消",
    missing_params: "缺少必要參數",
    invalid_state: "安全驗證失敗，請重新登入",
    login_failed: "登入失敗，請重試",
    not_logged_in: "請先登入",
    logout_failed: "登出失敗",
  };
  return messages[errorCode] || "發生錯誤，請重試";
}

