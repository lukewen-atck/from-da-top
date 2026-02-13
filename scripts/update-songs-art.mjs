
import fs from 'fs';
import path from 'path';

const songPath = path.join(process.cwd(), 'src/data/songs.js');
let content = fs.readFileSync(songPath, 'utf-8');

// Regex to capture the array
const regex = /export const songs_2026_02_13 = \[([\s\S]*?)\];/;
const match = content.match(regex);

if (!match) {
    console.error('Could not find songs array');
    process.exit(1);
}

// Parse the array
// We wrap it in parenthesis to eval it as an expression
const songs = eval('([' + match[1] + '])');

console.log(`Found ${songs.length} songs.`);

async function fetchArt(term) {
    // Try simplified term first (Artist Title)
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`;
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.results?.[0]?.artworkUrl100) {
            return data.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
        }
    } catch (e) {
        return null;
    }
    return null;
}

(async () => {
    const newSongs = [];
    for (const song of songs) {
        process.stdout.write(`Processing ${song.id}: ${song.artist} - ${song.title}... `);

        let term;
        // 1. Priority: Use explicit album search term if available
        if (song.album_search_term) {
            term = `${song.artist} ${song.album_search_term}`;
            console.log(`(Custom term: ${term})`);
        } else {
            // 2. Default: Artist + Title
            term = `${song.artist} ${song.title}`;
        }

        let art = await fetchArt(term);

        // 3. Fallback: If not found and title has parentheses, try removing them (only if not using custom term)
        if (!art && !song.album_search_term && song.title.includes('(')) {
            term = `${song.artist} ${song.title.split('(')[0]}`;
            art = await fetchArt(term);
        }

        if (art) {
            console.log('✅ Found');
            song.albumArt = art;
        } else {
            console.log('❌ Not found');
            // Keep existing (placeholder) if not found
        }

        newSongs.push(song);
        await new Promise(r => setTimeout(r, 250)); // Delay
    }

    const newArrayStr = JSON.stringify(newSongs, null, 2);
    // Replace the entire block
    const newContent = content.replace(regex, `export const songs_2026_02_13 = ${newArrayStr};`);

    fs.writeFileSync(songPath, newContent);
    console.log('Updated songs.js');
})();
