"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: string;
  lineUserId: string;
  displayName: string;
  pictureUrl: string | null;
  createdAt: string;
}

interface Artist {
  id: string;
  spotifyArtistId: string;
  name: string;
  imageUrl: string | null;
  followersTotal: number;
  genres: string[];
  followedAt: string;
}

interface UserData {
  user: User;
  spotifyConnected: boolean;
  spotifyTokenExpired: boolean;
  followedArtists: Artist[];
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // 取得使用者資料
  const fetchUserData = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch user data");
      }
      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      showToast("error", "載入使用者資料失敗");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();

    // 檢查 URL 參數
    const spotifyParam = searchParams.get("spotify");
    const errorParam = searchParams.get("error");

    if (spotifyParam === "connected") {
      showToast("success", "Spotify 連接成功！");
    }

    if (errorParam) {
      showToast("error", getErrorMessage(errorParam));
    }
  }, [fetchUserData, searchParams]);

  // 顯示 Toast
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // 同步追蹤的藝人
  const handleSyncArtists = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/spotify/sync-followed-artists", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "SPOTIFY_NOT_CONNECTED") {
          showToast("error", "請先連接 Spotify");
        } else if (data.code === "SPOTIFY_TOKEN_EXPIRED") {
          showToast("error", "Spotify 授權已過期，請重新連接");
        } else {
          showToast("error", data.error || "同步失敗");
        }
        return;
      }

      showToast("success", data.message || `同步完成，共 ${data.count} 位藝人`);
      await fetchUserData();
    } catch (error) {
      console.error("Error syncing artists:", error);
      showToast("error", "同步失敗，請重試");
    } finally {
      setSyncing(false);
    }
  };

  // 登出
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </main>
    );
  }

  if (!userData) {
    return null;
  }

  const { user, spotifyConnected, spotifyTokenExpired, followedArtists } = userData;

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white/10">
            {user.pictureUrl ? (
              <Image
                src={user.pictureUrl}
                alt={user.displayName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                👤
              </div>
            )}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-white">
              {user.displayName}
            </h1>
            <p className="text-white/50 text-sm">LINE 登入</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleLogout}
            className="btn btn-secondary text-sm px-4 py-2"
          >
            登出
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Spotify Connection */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-spotify-green" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Spotify
            </h2>

            {/* Connection Status */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    spotifyConnected && !spotifyTokenExpired
                      ? "bg-spotify-green"
                      : spotifyTokenExpired
                      ? "bg-yellow-500"
                      : "bg-white/30"
                  }`}
                />
                <span className="text-white/70 text-sm">
                  {spotifyConnected && !spotifyTokenExpired
                    ? "已連接"
                    : spotifyTokenExpired
                    ? "授權已過期"
                    : "未連接"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!spotifyConnected || spotifyTokenExpired ? (
                <Link
                  href="/api/auth/spotify/login"
                  className="btn btn-spotify w-full"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  {spotifyTokenExpired ? "重新連接 Spotify" : "連接 Spotify"}
                </Link>
              ) : (
                <button
                  onClick={handleSyncArtists}
                  disabled={syncing}
                  className="btn btn-spotify w-full disabled:opacity-50"
                >
                  {syncing ? (
                    <>
                      <div className="spinner" />
                      同步中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      同步追蹤藝人
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Stats */}
            {spotifyConnected && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-white">
                    {followedArtists.length}
                  </div>
                  <div className="text-white/50 text-sm">追蹤的藝人</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Area - Artists List */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="text-2xl">🎤</span>
              追蹤的藝人
            </h2>

            {followedArtists.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎵</div>
                <p className="text-white/50 mb-4">
                  {spotifyConnected
                    ? "尚未同步藝人，點擊「同步追蹤藝人」開始"
                    : "連接 Spotify 後即可同步追蹤的藝人"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] scroll-container pr-2">
                {followedArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`toast ${
            toast.type === "success"
              ? "border border-spotify-green/30 text-spotify-green"
              : "border border-red-500/30 text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}

function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div className="artist-card flex items-start gap-4 p-4 rounded-xl bg-white/5">
      {/* Artist Image */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
        {artist.imageUrl ? (
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            🎤
          </div>
        )}
      </div>

      {/* Artist Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{artist.name}</h3>
        <p className="text-white/50 text-sm mb-2">
          {formatFollowers(artist.followersTotal)} 粉絲
        </p>
        {/* Genres */}
        {artist.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {artist.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="genre-badge">
                {genre}
              </span>
            ))}
            {artist.genres.length > 3 && (
              <span className="genre-badge">+{artist.genres.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}

function getErrorMessage(errorCode: string): string {
  const messages: Record<string, string> = {
    spotify_login_failed: "Spotify 登入失敗",
    spotify_auth_cancelled: "Spotify 授權已取消",
    spotify_connect_failed: "Spotify 連接失敗",
    missing_params: "缺少必要參數",
    invalid_state: "安全驗證失敗",
    not_logged_in: "請先登入",
  };
  return messages[errorCode] || "發生錯誤";
}

