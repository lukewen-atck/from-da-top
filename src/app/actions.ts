
'use server';

import { db } from '../db';
import { users, songs } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// 1. getOrCreateUser
export async function getOrCreateUser(uid: string) {
    try {
        // Check if user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.uid, uid),
            with: {
                selectedSong: true, // Assuming we set up relation, otherwise query separately
            }
        });

        if (existingUser) {
            // Fetch the actual song details if selected_song_id exists
            let songDetails = null;
            if (existingUser.selected_song_id) {
                songDetails = await db.query.songs.findFirst({
                    where: eq(songs.id, existingUser.selected_song_id),
                });
            }
            return {
                user: existingUser,
                selectedSong: songDetails,
                status: existingUser.selected_song_id ? 'LOCKED' : 'UNLOCKED'
            };
        }

        // Create new user
        const newUser = await db.insert(users).values({ uid }).returning() as any[];
        return {
            user: newUser[0],
            selectedSong: null,
            status: 'UNLOCKED'
        };
    } catch (error) {
        console.error('getOrCreateUser error:', error);
        throw new Error('Failed to fetch or create user');
    }
}

// 2. drawSong
export async function drawSong(uid: string, mood?: string | null, voice?: string | null) {
    try {
        // Verify user exists/permission (optional for this simple app)

        // Build query conditions
        const conditions = [eq(songs.is_taken, false)];

        if (mood) {
            conditions.push(eq(songs.tempo, mood));
        }

        if (voice) {
            conditions.push(eq(songs.vocal, voice));
        }

        // Random selection of available song matching criteria
        const randomSong = await db.select()
            .from(songs)
            .where(and(...conditions))
            .orderBy(sql`RANDOM()`)
            .limit(1);

        if (randomSong.length === 0) {
            return { error: 'No songs available matching criteria' };
        }

        return { song: randomSong[0] };
    } catch (error) {
        console.error('drawSong error:', error);
        throw new Error('Failed to draw song');
    }
}

// 3. confirmSong
export async function confirmSong(songId: number, uid: string) {
    try {
        // 1. Double check song availability
        const song = await db.query.songs.findFirst({
            where: and(eq(songs.id, songId), eq(songs.is_taken, false)),
        });

        if (!song) {
            return { success: false, message: 'Song already taken or invalid' };
        }

        // 2. Lock song
        await db.update(songs)
            .set({ is_taken: true, taken_by: uid })
            .where(eq(songs.id, songId));

        // 3. Update user
        await db.update(users)
            .set({ selected_song_id: songId })
            .where(eq(users.uid, uid));

        revalidatePath('/'); // Refresh UI
        return { success: true };
    } catch (error) {
        console.error('confirmSong error:', error);
        return { success: false, message: 'Operation failed' };
    }
}

// 4. executeReroll
export async function executeReroll(uid: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.uid, uid),
        });

        if (!user) return { success: false, message: 'User not found' };
        if (user.has_rerolled) return { success: false, message: 'Already rerolled' };

        await db.update(users)
            .set({ has_rerolled: true })
            .where(eq(users.uid, uid));

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('executeReroll error:', error);
        return { success: false, message: 'Failed to execute reroll' };
    }
}
