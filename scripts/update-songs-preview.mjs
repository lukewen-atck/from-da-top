
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
const songs = eval('([' + match[1] + '])');

console.log(`Found ${songs.length} songs.`);

async function fetchPreview(term) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`;
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        // Return previewUrl if available
        if (data.results?.[0]?.previewUrl) {
            return data.results[0].previewUrl;
        }
    } catch (e) {
        return null;
    }
    return null;
}

(async () => {
    const newSongs = [];
    for (const song of songs) {
        // Skip if already has previewUrl (though we are adding it fresh now)
        if (song.previewUrl) {
            newSongs.push(song);
            continue;
        }

        process.stdout.write(`Processing ${song.id}: ${song.artist} - ${song.title}... `);

        let term = `${song.artist} ${song.title}`;
        let preview = await fetchPreview(term);

        if (!preview && song.title.includes('(')) {
            term = `${song.artist} ${song.title.split('(')[0]}`;
            preview = await fetchPreview(term);
        }

        // Final fallback: try just title if artist + title fails? (Risky, might get wrong cover)
        // Let's stick to safer searches.

        if (preview) {
            console.log('✅ Found');
            song.previewUrl = preview;
        } else {
            console.log('❌ Not found');
        }

        newSongs.push(song);
        await new Promise(r => setTimeout(r, 250)); // Rate limit
    }

    const newArrayStr = JSON.stringify(newSongs, null, 2);
    const newContent = content.replace(regex, `export const songs_2026_02_13 = ${newArrayStr};`);

    fs.writeFileSync(songPath, newContent);
    console.log('Updated songs.js with previews');
})();
