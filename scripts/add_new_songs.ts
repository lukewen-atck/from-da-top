import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import * as dotenv from 'dotenv';
import { songs } from '../src/data/songs';
import { inArray, notInArray } from 'drizzle-orm';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sqlConnection = neon(process.env.DATABASE_URL);
const db = drizzle(sqlConnection, { schema });

async function main() {
    console.log('🌱 Adding new songs to database...');

    try {
        const existingSongs = await db.select({ title: schema.songs.title, artist: schema.songs.artist }).from(schema.songs);
        const existingSet = new Set(existingSongs.map(s => `${s.artist}-${s.title}`));

        let songsToInsert = songs.filter(s => !existingSet.has(`${s.artist}-${s.title}`));
        
        if (songsToInsert.length === 0) {
            console.log('No new songs to insert.');
            process.exit(0);
        }

        const insertData = songsToInsert.map((s: any) => ({
            title: s.title,
            artist: s.artist,
            year: s.year ? String(s.year) : null,
            tempo: s.tempo,
            vocal: s.vocal,
            albumArt: s.albumArt,
            preview_url: s.previewUrl || null,
            is_taken: false,
            taken_by: null,
        }));

        console.log(`Inserting ${insertData.length} new songs...`);

        const CHUNK_SIZE = 50;
        for (let i = 0; i < insertData.length; i += CHUNK_SIZE) {
            const chunk = insertData.slice(i, i + CHUNK_SIZE);
            await db.insert(schema.songs).values(chunk);
            console.log(`Inserted chunk ${i / CHUNK_SIZE + 1}`);
        }

        console.log('✅ New songs added completed!');
    } catch (error) {
        console.error('❌ Adding failed:', error);
        process.exit(1);
    }
}

main();
