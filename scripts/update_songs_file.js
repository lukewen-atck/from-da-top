
import fs from 'fs';
import path from 'path';

const songsPath = path.join(process.cwd(), 'src/data/songs.js');
const newSongsPath = path.join(process.cwd(), 'src/data/songs_new.js');

try {
    let songsContent = fs.readFileSync(songsPath, 'utf-8');
    const newSongsContent = fs.readFileSync(newSongsPath, 'utf-8');

    // 1. Update CURRENT_VERSION
    songsContent = songsContent.replace(
        "export const CURRENT_VERSION = 'songs_0204';",
        "export const CURRENT_VERSION = 'songs_2026_02_13';"
    );

    // 2. Insert new songs array before getAlbumArt
    // We look for the comment block before getAlbumArt to keep it clean
    const insertionPointStr = '// ============================================================\n// 獲取專輯封面';

    if (!songsContent.includes(insertionPointStr)) {
        console.error('Could not find insertion point');
        process.exit(1);
    }

    songsContent = songsContent.replace(
        insertionPointStr,
        newSongsContent + '\n\n' + insertionPointStr
    );

    // 3. Update songVersions
    songsContent = songsContent.replace(
        "'songs_0204': songs_0204,",
        "'songs_0204': songs_0204,\n  'songs_2026_02_13': songs_2026_02_13,"
    );

    fs.writeFileSync(songsPath, songsContent);
    console.log('Successfully updated songs.js');

} catch (err) {
    console.error('Error updating songs.js:', err);
    process.exit(1);
}
