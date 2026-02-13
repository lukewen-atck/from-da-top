
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import * as dotenv from 'dotenv';
import { songs } from '../src/data/songs'; // Import current song data
import { sql } from 'drizzle-orm';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sqlConnection = neon(process.env.DATABASE_URL);
const db = drizzle(sqlConnection, { schema });

async function main() {
    console.log('🌱 Seeding database...');

    try {
        // 1. Clear existing songs
        console.log('Cleaning existing songs...');
        await db.delete(schema.songs);

        // 2. Prepare data
        // Convert current songs format to db schema format if needed
        // Assuming importing `songs` gives an array of objects matching schema mostly
        const songsToInsert = songs.map((s: any) => ({
            title: s.title,
            artist: s.artist,
            year: s.year ? String(s.year) : null,
            tempo: s.tempo,
            vocal: s.vocal,
            albumArt: s.albumArt,
            is_taken: false,
            taken_by: null,
        }));

        // 3. Insert new songs (batch insert)
        console.log(`Inserting ${songsToInsert.length} songs...`);

        // Split into chunks to avoid potential limits
        const CHUNK_SIZE = 50;
        for (let i = 0; i < songsToInsert.length; i += CHUNK_SIZE) {
            const chunk = songsToInsert.slice(i, i + CHUNK_SIZE);
            await db.insert(schema.songs).values(chunk);
            console.log(`Inserted chunk ${i / CHUNK_SIZE + 1}`);
        }

        console.log('✅ Seeding completed!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

main();
