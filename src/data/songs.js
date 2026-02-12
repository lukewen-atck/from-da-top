// ============================================================
// FROM DA ECHO CHALLENGE - 金曲翻唱挑戰系統
// 歌曲資料庫 (Data Versioning)
// 最後更新：2026-02-04
// ============================================================

// ============================================================
// 版本控制設定
// ============================================================
export const CURRENT_VERSION = 'songs_0204';

// ============================================================
// 曲風分類（用於篩選介面）
// ============================================================
export const moodCategories = {
  '抒情': { label: '抒情', icon: '💔', color: 'from-blue-500 to-purple-500' },
  '輕快': { label: '輕快', icon: '🌈', color: 'from-green-400 to-cyan-400' },
  '快歌': { label: '快歌', icon: '🔥', color: 'from-orange-500 to-red-500' },
};

// ============================================================
// 聲線分類（用於篩選介面）
// ============================================================
export const voiceCategories = {
  '男生': { label: '男生', icon: '👨', color: 'from-blue-600 to-indigo-600' },
  '女生': { label: '女生', icon: '👩', color: 'from-pink-500 to-rose-500' },
  '團體/合唱': { label: '團體/合唱', icon: '👥', color: 'from-purple-500 to-fuchsia-500' },
};

// ============================================================
// 曲風短評對照表
// ============================================================
export const genreComments = {
  '抒情': '記得準備衛生紙，眼淚要掉了 😢',
  '輕快': '這節奏讓人心情變好了！🌈',
  '快歌': '這首歌承包了你的 KTV 熱舞時光 🕺',
  '搖滾': '甩頭甩到脖子痠！🎸',
  'R&B': '轉音轉到頭暈了嗎？💫',
  '抒情搖滾': '溫柔中帶點力量，經典配方！🎸',
  '輕快搖滾': '搖滾也可以很陽光！☀️',
  '中國風': '古風韻味，穿越千年的感動 🏮',
  '電子': '這就是當年的電音派對 🎧',
  '舞曲': '舞池裡最閃亮的回憶 💃',
};

// ============================================================
// 專輯封面 - 使用 Unsplash 隨機音樂相關圖片作為佔位符
// 您可以將這些 URL 替換為實際的專輯封面
// ============================================================

// 生成佔位圖片 URL（使用 picsum.photos 隨機圖片）
const getPlaceholderImage = (id) => {
  // 使用固定種子確保每首歌的圖片一致
  return `https://picsum.photos/seed/song${id}/300/300`;
};

// ============================================================
// songs_0204 - 2026/02/04 版本（50首）- 含專輯封面
// ============================================================
export const songs_0204 = [
  { id: 1, title: '1001個願望', artist: '4 In Love', year: '2001', tempo: '輕快', vocal: '團體/合唱',
    albumArt: 'https://picsum.photos/seed/4inlove1001/300/300' },
  { id: 2, title: '流星雨', artist: 'F4', year: '2001', tempo: '抒情', vocal: '團體/合唱',
    albumArt: 'https://picsum.photos/seed/f4meteor/300/300' },
  { id: 3, title: '第一時間', artist: 'F4', year: '2001', tempo: '輕快', vocal: '團體/合唱',
    albumArt: 'https://picsum.photos/seed/f4first/300/300' },
  { id: 4, title: '煙火的季節', artist: 'F4', year: '2002', tempo: '抒情', vocal: '團體/合唱',
    albumArt: 'https://picsum.photos/seed/f4firework/300/300' },
  { id: 5, title: '唯一', artist: '王力宏', year: '2001', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/wanglihom1/300/300' },
  { id: 6, title: '愛的就是你', artist: '王力宏', year: '2001', tempo: '輕快', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/wanglihom2/300/300' },
  { id: 7, title: '心電心', artist: '王心凌', year: '2009', tempo: '快歌', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/cyndi1/300/300' },
  { id: 8, title: '我會很愛你', artist: '言承旭', year: '2009', tempo: '輕快', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/jerry1/300/300' },
  { id: 9, title: '黃昏', artist: '周傳雄', year: '2000', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/steve1/300/300' },
  { id: 10, title: '寂寞沙洲冷', artist: '周傳雄', year: '2005', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/steve2/300/300' },
  { id: 11, title: '零', artist: '柯有綸', year: '2004', tempo: '快歌', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/alan1/300/300' },
  { id: 12, title: '哭笑不得', artist: '柯有綸', year: '2005', tempo: '輕快', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/alan2/300/300' },
  { id: 13, title: 'Superman', artist: '倪子岡', year: '2008', tempo: '快歌', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/nicky1/300/300' },
  { id: 14, title: '情非得已', artist: '庾澄慶', year: '2001', tempo: '輕快', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/harlem1/300/300' },
  { id: 15, title: '海嘯', artist: '庾澄慶', year: '2001', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/harlem2/300/300' },
  { id: 16, title: '難以抗拒你容顏', artist: '張信哲', year: '2000', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/jeff1/300/300' },
  { id: 17, title: '寶貝', artist: '張懸', year: '2006', tempo: '輕快', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/deserts1/300/300' },
  { id: 18, title: '喜歡', artist: '張懸', year: '2007', tempo: '輕快', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/deserts2/300/300' },
  { id: 19, title: '如果沒有你', artist: '莫文蔚', year: '2006', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/karen1/300/300' },
  { id: 20, title: '愛', artist: '莫文蔚', year: '2002', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/karen2/300/300' },
  { id: 21, title: '男人女人', artist: '許茹芸', year: '2007', tempo: '抒情', vocal: '團體/合唱',
    albumArt: 'https://picsum.photos/seed/valen1/300/300' },
  { id: 22, title: '我愛的人', artist: '陳小春', year: '2001', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/jordan1/300/300' },
  { id: 23, title: '下半輩子', artist: '陳小春', year: '2002', tempo: '輕快', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/jordan2/300/300' },
  { id: 24, title: '喜歡兩個人', artist: '彭佳慧', year: '2001', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/julia1/300/300' },
  { id: 25, title: '走在紅毯那一天', artist: '彭佳慧', year: '2002', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/julia2/300/300' },
  { id: 26, title: '回味', artist: '彭佳慧', year: '2000', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/julia3/300/300' },
  { id: 27, title: '戀上一個人', artist: '游鴻明', year: '2002', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/chris1/300/300' },
  { id: 28, title: '下沙', artist: '游鴻明', year: '2000', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/chris2/300/300' },
  { id: 29, title: '詩人的眼淚', artist: '游鴻明', year: '2006', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/chris3/300/300' },
  { id: 30, title: '那女孩對我說', artist: '黃義達', year: '2005', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/yida1/300/300' },
  { id: 31, title: '藍天', artist: '黃義達', year: '2004', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/yida2/300/300' },
  { id: 32, title: '雨愛', artist: '楊丞琳', year: '2009', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/rainie1/300/300' },
  { id: 33, title: '曖昧', artist: '楊丞琳', year: '2005', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/rainie2/300/300' },
  { id: 34, title: '缺氧', artist: '楊丞琳', year: '2007', tempo: '輕快', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/rainie3/300/300' },
  { id: 35, title: '獨立', artist: '蜜雪薇琪', year: '2004', tempo: '輕快', vocal: '團體/合唱',
    albumArt: 'https://picsum.photos/seed/michelle1/300/300' },
  { id: 36, title: '彩虹天堂', artist: '劉畊宏', year: '2005', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/will1/300/300' },
  { id: 37, title: '倒帶', artist: '蔡依林', year: '2004', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/jolin1/300/300' },
  { id: 38, title: '說愛你', artist: '蔡依林', year: '2003', tempo: '輕快', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/jolin2/300/300' },
  { id: 39, title: '天空', artist: '蔡依林', year: '2005', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/jolin3/300/300' },
  { id: 40, title: '檸檬草的味道', artist: '蔡依林', year: '2004', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/jolin4/300/300' },
  { id: 41, title: '看我七十二變', artist: '蔡依林', year: '2003', tempo: '快歌', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/jolin5/300/300' },
  { id: 42, title: '布拉格廣場', artist: '蔡依林', year: '2003', tempo: '快歌', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/jolin6/300/300' },
  { id: 43, title: '愛情三十六計', artist: '蔡依林', year: '2004', tempo: '快歌', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/jolin7/300/300' },
  { id: 44, title: '睜一隻眼一隻眼', artist: '蔡依林', year: '2005', tempo: '快歌', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/jolin8/300/300' },
  { id: 45, title: '野蠻遊戲', artist: '蔡依林', year: '2005', tempo: '快歌', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/jolin9/300/300' },
  { id: 46, title: '我可以', artist: '蔡旻佑', year: '2006', tempo: '抒情', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/evan1/300/300' },
  { id: 47, title: '小乖乖', artist: '蔡旻佑', year: '2009', tempo: '輕快', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/evan2/300/300' },
  { id: 48, title: '王妃', artist: '蕭敬騰', year: '2009', tempo: '快歌', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/jam1/300/300' },
  { id: 49, title: '阿飛的小蝴蝶', artist: '蕭敬騰', year: '2009', tempo: '輕快', vocal: '男生',
    albumArt: 'https://picsum.photos/seed/jam2/300/300' },
  { id: 50, title: '空港', artist: '戴愛玲', year: '2009', tempo: '抒情', vocal: '女生',
    albumArt: 'https://picsum.photos/seed/princess1/300/300' },
];

// ============================================================
// 獲取專輯封面（含備用方案）
// ============================================================
export function getAlbumArt(song) {
  if (song.albumArt) {
    return song.albumArt;
  }
  // 備用：使用 picsum 生成圖片
  return `https://picsum.photos/seed/song${song.id}/300/300`;
}

// ============================================================
// songs_v1 - 原始版本（簡化保留）
// ============================================================
export const songs_v1 = [
  { id: 1, artist: 'F4', title: '流星雨', year: 2001, label: '索尼音樂', genre: '抒情', mood: '抒情', voice: '合唱' },
  { id: 2, artist: 'F4', title: '第一時間', year: 2001, label: '索尼音樂', genre: '輕快', mood: '輕快', voice: '合唱' },
];

// ============================================================
// 版本映射表
// ============================================================
const songVersions = {
  'songs_v1': songs_v1,
  'songs_0204': songs_0204,
};

// ============================================================
// 獲取當前版本的歌曲列表
// ============================================================
export function getCurrentSongs() {
  return songVersions[CURRENT_VERSION] || songs_0204;
}

// ============================================================
// 取得歌曲資料（根據當前版本）
// ============================================================
export const songs = getCurrentSongs();

// ============================================================
// 根據篩選條件過濾歌曲
// ============================================================
export function filterSongs(tempoFilter, vocalFilter) {
  const currentSongs = getCurrentSongs();
  return currentSongs.filter(song => {
    const tempoMatch = !tempoFilter || tempoFilter === 'all' || song.tempo === tempoFilter;
    const vocalMatch = !vocalFilter || vocalFilter === 'all' || song.vocal === vocalFilter;
    return tempoMatch && vocalMatch;
  });
}

// ============================================================
// 獲取統計資訊
// ============================================================
export function getSongStats() {
  const currentSongs = getCurrentSongs();
  const stats = {
    total: currentSongs.length,
    byTempo: {},
    byVocal: {},
  };
  
  currentSongs.forEach(song => {
    const tempo = song.tempo || song.mood;
    const vocal = song.vocal || song.voice;
    stats.byTempo[tempo] = (stats.byTempo[tempo] || 0) + 1;
    stats.byVocal[vocal] = (stats.byVocal[vocal] || 0) + 1;
  });
  
  return stats;
}

export default songs;
