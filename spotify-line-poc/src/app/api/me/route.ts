import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 取得使用者追蹤的藝人
    const followedArtists = await prisma.userFollowArtist.findMany({
      where: { userId: user.id },
      include: { artist: true },
      orderBy: { followedAt: "desc" },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        lineUserId: user.lineUserId,
        displayName: user.displayName,
        pictureUrl: user.pictureUrl,
        createdAt: user.createdAt,
      },
      spotifyConnected: user.spotifyConnected,
      spotifyTokenExpired: user.spotifyTokenExpired,
      followedArtists: followedArtists.map((fa) => ({
        id: fa.artist.id,
        spotifyArtistId: fa.artist.spotifyArtistId,
        name: fa.artist.name,
        imageUrl: fa.artist.imageUrl,
        followersTotal: fa.artist.followersTotal,
        genres: fa.artist.genres,
        followedAt: fa.followedAt,
      })),
    });
  } catch (error) {
    console.error("[/api/me] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

