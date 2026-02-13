
import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), 'src/data/songs.csv');

try {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');

    const songs = lines.map((line, index) => {
        // Basic CSV split, assuming no commas in fields for this specific dataset
        // If there were commas in fields, we'd need a proper parser logic/lib
        const cols = line.split(',').map(c => c.trim());

        // Columns based on user input & file inspection:
        // 0: Artist
        // 1: Title
        // 2: Year
        // 5: Genre/Tempo (e.g., '輕快 / 流行')
        // 6: Voice (e.g., '女聲 (團體)')

        if (cols.length < 5) return null;

        const artist = cols[0];
        const title = cols[1];

        if (!artist || !title) return null;
        const year = cols[2];
        const rawTempo = cols[5] || '';
        const rawVoice = cols[6] || '';

        // Mapping Logic
        let tempo = '抒情'; // Default
        if (rawTempo.includes('快歌')) tempo = '快歌';
        else if (rawTempo.includes('輕快')) tempo = '輕快';
        else if (rawTempo.includes('抒情')) tempo = '抒情';

        let vocal = '男生'; // Default
        if (rawVoice.includes('團體') || rawVoice.includes('合唱') || rawVoice.includes('對唱')) vocal = '團體/合唱';
        else if (rawVoice.includes('女')) vocal = '女生';
        else if (rawVoice.includes('男')) vocal = '男生';

        const id = index + 1;
        // Generate static picsum seed
        const albumArt = `https://picsum.photos/seed/sony${id}/300/300`;

        return {
            id,
            title,
            artist,
            year,
            tempo,
            vocal,
            albumArt
        };
    }).filter(s => s !== null);

    console.log('export const songs_2026_02_13 = ' + JSON.stringify(songs, null, 2) + ';');

} catch (err) {
    console.error('Error reading CSV:', err);
}
