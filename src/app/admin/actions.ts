'use server';

import { db } from '../../db';
import { users, songs } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// 1. Get Admin Data
export async function getAdminData() {
    try {
        const allUsers = await db.query.users.findMany({
            with: {
                selectedSong: true,
            },
            orderBy: (users, { desc }) => [desc(users.created_at)],
        });

        const allSongs = await db.query.songs.findMany({
            orderBy: (songs, { asc }) => [asc(songs.id)],
        });

        const stats = {
            totalSongs: allSongs.length,
            takenSongs: allSongs.filter(s => s.is_taken).length,
            totalUsers: allUsers.length,
        };

        return { users: allUsers, songs: allSongs, stats };
    } catch (error) {
        console.error('getAdminData error:', error);
        return { users: [], songs: [], stats: { totalSongs: 0, takenSongs: 0, totalUsers: 0 } };
    }
}

// 2. Reset User
export async function adminResetUser(uid: string) {
    try {
        await db.transaction(async (tx) => {
            // 1. Find user to get current song
            const user = await tx.query.users.findFirst({
                where: eq(users.uid, uid),
            });

            if (!user) throw new Error('User not found');

            // 2. If user has a song, free it
            if (user.selected_song_id) {
                await tx.update(songs)
                    .set({ is_taken: false, taken_by: null })
                    .where(eq(songs.id, user.selected_song_id));
            }

            // 3. Reset user
            await tx.update(users)
                .set({ selected_song_id: null, has_rerolled: false })
                .where(eq(users.uid, uid));
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error: any) {
        console.error('adminResetUser error:', error);
        return { success: false, message: error.message || 'Reset failed' };
    }
}

// 3. Assign Song
export async function adminAssignSong(uid: string, songId: number) {
    try {
        await db.transaction(async (tx) => {
            // 1. Check if song exists
            const song = await tx.query.songs.findFirst({
                where: eq(songs.id, songId),
            });

            if (!song) throw new Error('找不到該歌曲 (Song ID not found)');

            // 2. Clear user's current song if any
            const user = await tx.query.users.findFirst({
                where: eq(users.uid, uid),
            });

            if (user?.selected_song_id) {
                await tx.update(songs)
                    .set({ is_taken: false, taken_by: null })
                    .where(eq(songs.id, user.selected_song_id));
            }

            // 3. If target song is taken by someone else, we force take it
            if (song.is_taken && song.taken_by && song.taken_by !== uid) {
                await tx.update(users)
                    .set({ selected_song_id: null })
                    .where(eq(users.uid, song.taken_by));
            }

            // 4. Update Song
            await tx.update(songs)
                .set({ is_taken: true, taken_by: uid })
                .where(eq(songs.id, songId));

            // 5. Update User
            await tx.update(users)
                .set({ selected_song_id: songId })
                .where(eq(users.uid, uid));
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error: any) {
        console.error('adminAssignSong error:', error);
        return { success: false, message: error.message || 'Assign failed' };
    }
}

// 4. Update User Profile (Name/Note)
export async function adminUpdateUser(uid: string, name: string, note: string) {
    try {
        await db.update(users)
            .set({ name, note })
            .where(eq(users.uid, uid));

        revalidatePath('/admin');
        return { success: true };
    } catch (error: any) {
        console.error('adminUpdateUser error:', error);
        return { success: false, message: error.message || 'Update failed' };
    }
}
