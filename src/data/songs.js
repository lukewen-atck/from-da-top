// ============================================================
// FROM DA ECHO CHALLENGE - 金曲翻唱挑戰系統
// 歌曲資料庫 (Data Versioning)
// 最後更新：2026-02-04
// ============================================================

// ============================================================
// 版本控制設定
// ============================================================
export const CURRENT_VERSION = 'songs_2026_02_13';

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

export const songs_2026_02_13 = [
  {
    "id": 1,
    "title": "1001個願望",
    "artist": "4 In Love",
    "year": "2001",
    "tempo": "輕快",
    "vocal": "團體/合唱",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/56/80/80/5680800f-d526-fa0a-aead-0cab4df4699c/886446889665.jpg/600x600bb.jpg"
  },
  {
    "id": 2,
    "title": "大城小愛",
    "artist": "王力宏",
    "year": "2005",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f9/82/88/f98288eb-ea32-6c8c-7919-357c31a4b437/1400X1400.jpg/600x600bb.jpg"
  },
  {
    "id": 3,
    "title": "心中的日月",
    "artist": "王力宏",
    "year": "2004",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Features/c2/0c/44/dj.smpllcgy.jpg/600x600bb.jpg"
  },
  {
    "id": 4,
    "title": "如果你聽見我的歌",
    "artist": "王力宏",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/4e/cf/db/mzi.ypabaoxf.jpg/600x600bb.jpg"
  },
  {
    "id": 5,
    "title": "你不在",
    "artist": "王力宏",
    "year": "2003",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/1f/c2/bf1fc215-9240-cb99-ef57-ad2dd855610a/dj.tlgtqqag.png/600x600bb.jpg"
  },
  {
    "id": 6,
    "title": "我們的歌",
    "artist": "王力宏",
    "year": "2007",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d6/d1/bb/d6d1bb74-e2d3-743e-f514-5668390c4d67/gaibianziji_fengmian.jpg/600x600bb.jpg"
  },
  {
    "id": 7,
    "title": "依然愛你",
    "artist": "王力宏",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c3/5d/3b/c35d3b17-40cd-f24c-d72b-1f2a6099c6e9/Open_Fire_cover.jpg/600x600bb.jpg"
  },
  {
    "id": 8,
    "title": "放開你的心",
    "artist": "王力宏",
    "year": "2004",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Features/c2/0c/44/dj.smpllcgy.jpg/600x600bb.jpg"
  },
  {
    "id": 9,
    "title": "花田錯",
    "artist": "王力宏",
    "year": "2005",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f9/82/88/f98288eb-ea32-6c8c-7919-357c31a4b437/1400X1400.jpg/600x600bb.jpg"
  },
  {
    "id": 10,
    "title": "唯一",
    "artist": "王力宏",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/48/fd/2f/48fd2fe5-31b2-d979-53a4-9aebf5175bdb/mzi.biqraozb.jpg/600x600bb.jpg"
  },
  {
    "id": 11,
    "title": "愛的就是你",
    "artist": "王力宏",
    "year": "2001",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/48/fd/2f/48fd2fe5-31b2-d979-53a4-9aebf5175bdb/mzi.biqraozb.jpg/600x600bb.jpg"
  },
  {
    "id": 12,
    "title": "愛錯",
    "artist": "王力宏",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/be/4a/77/be4a7730-c144-a39e-c7b6-9d26ea0ebff3/1400X1400.jpg/600x600bb.jpg"
  },
  {
    "id": 13,
    "title": "落葉歸根",
    "artist": "王力宏",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d6/d1/bb/d6d1bb74-e2d3-743e-f514-5668390c4d67/gaibianziji_fengmian.jpg/600x600bb.jpg"
  },
  {
    "id": 14,
    "title": "Kiss Goodbye",
    "artist": "王力宏",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f9/82/88/f98288eb-ea32-6c8c-7919-357c31a4b437/1400X1400.jpg/600x600bb.jpg"
  },
  {
    "id": 15,
    "title": "W-H-Y",
    "artist": "王力宏",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Features/c2/0c/44/dj.smpllcgy.jpg/600x600bb.jpg"
  },
  {
    "id": 16,
    "title": "心電心",
    "artist": "王心凌",
    "year": "2009",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/ec/b5/3f/ecb53fef-904b-89b5-1a38-7e402f053007/196871423175.jpg/600x600bb.jpg"
  },
  {
    "id": 17,
    "title": "青春紀念冊",
    "artist": "可米小子",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "團體/合唱",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b9/41/93/b941939c-84e2-b8cf-5099-7698d1a5fb40/mzi.ynielmpd.jpg/600x600bb.jpg"
  },
  {
    "id": 18,
    "title": "一九九九",
    "artist": "伍思凱",
    "year": "2003",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony18/300/300"
  },
  {
    "id": 19,
    "title": "真情人",
    "artist": "李玟",
    "year": "2000",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/6d/80/35/6d8035bf-86e1-9f6d-6afe-e83660e28a65/mzi.zhoaufjn.jpg/600x600bb.jpg"
  },
  {
    "id": 20,
    "title": "真愛冒險",
    "artist": "李玟",
    "year": "2000",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony20/300/300"
  },
  {
    "id": 21,
    "title": "暗示",
    "artist": "李玟",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0e/7f/b7/0e7fb735-0898-7a99-3fc3-e23913cce413/886447846575.jpg/600x600bb.jpg"
  },
  {
    "id": 22,
    "title": "一公尺",
    "artist": "言承旭",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/3d/6b/88/mzi.jpzngnqo.jpg/600x600bb.jpg"
  },
  {
    "id": 23,
    "title": "我會很愛你",
    "artist": "言承旭",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/71/50/b5/7150b5f4-e441-4b4c-255f-724d91e63535/mzi.algikrvk.jpg/600x600bb.jpg"
  },
  {
    "id": 24,
    "title": "七里香",
    "artist": "周杰倫",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/58/8d/6d/588d6d61-fbac-148a-86bd-0030ce076ac1/23UM1IM57281.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 25,
    "title": "千里之外",
    "artist": "周杰倫",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/1c/10/ad/1c10ad86-a96c-15e4-f809-360f53011b04/23UM1IM58801.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 26,
    "title": "牛仔很忙",
    "artist": "周杰倫",
    "year": "2007",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f7/2c/9f/f72c9fc6-c4dc-d6a0-4386-0478b09cb797/23UM1IM58609.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 27,
    "title": "以父之名",
    "artist": "周杰倫",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8c/47/86/8c47862d-e254-8b49-30cf-d1f05ebba05b/23UM1IM56855.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 28,
    "title": "可愛女人",
    "artist": "周杰倫",
    "year": "2000",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/69/f7/7f/69f77f5e-9b36-917e-cf15-7bd8442572c7/23UM1IM56109.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 29,
    "title": "回到過去",
    "artist": "周杰倫",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/14/b9/fa/14b9fa3f-ef0c-01de-3721-93ff740062b5/23UM1IM56711.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 30,
    "title": "安靜",
    "artist": "周杰倫",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/14/b9/fa/14b9fa3f-ef0c-01de-3721-93ff740062b5/23UM1IM56711.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 31,
    "title": "夜曲",
    "artist": "周杰倫",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/69/49/61/694961f3-1414-355e-66e4-9649ba13ec55/23UM1IM57770.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 32,
    "title": "青花瓷",
    "artist": "周杰倫",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f7/2c/9f/f72c9fc6-c4dc-d6a0-4386-0478b09cb797/23UM1IM58609.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 33,
    "title": "威廉古堡",
    "artist": "周杰倫",
    "year": "2001",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/14/b9/fa/14b9fa3f-ef0c-01de-3721-93ff740062b5/23UM1IM56711.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 34,
    "title": "晴天",
    "artist": "周杰倫",
    "year": "2003",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8c/47/86/8c47862d-e254-8b49-30cf-d1f05ebba05b/23UM1IM56855.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 35,
    "title": "黑色幽默",
    "artist": "周杰倫",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/69/f7/7f/69f77f5e-9b36-917e-cf15-7bd8442572c7/23UM1IM56109.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 36,
    "title": "愛在西元前",
    "artist": "周杰倫",
    "year": "2001",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony36/300/300"
  },
  {
    "id": 37,
    "title": "說好的幸福呢",
    "artist": "周杰倫",
    "year": "2008",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony37/300/300"
  },
  {
    "id": 38,
    "title": "稻香",
    "artist": "周杰倫",
    "year": "2008",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony38/300/300"
  },
  {
    "id": 39,
    "title": "龍捲風",
    "artist": "周杰倫",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2b/09/2c/2b092c5a-2e54-149c-9984-b3139bc35b1f/23UM1IM59801.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 40,
    "title": "龍戰騎士",
    "artist": "周杰倫",
    "year": "2008",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/53/6c/72/536c7219-e177-a912-9322-e1abf70e8733/23UM1IM58828.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 41,
    "title": "簡單愛",
    "artist": "周杰倫",
    "year": "2001",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/14/b9/fa/14b9fa3f-ef0c-01de-3721-93ff740062b5/23UM1IM56711.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 42,
    "title": "雙截棍",
    "artist": "周杰倫",
    "year": "2001",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/52/f8/f5/52f8f5a7-1a1e-3491-16bd-240914fb60c8/23UM1IM59705.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 43,
    "title": "蘭亭序",
    "artist": "周杰倫",
    "year": "2008",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/53/6c/72/536c7219-e177-a912-9322-e1abf70e8733/23UM1IM58828.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 44,
    "title": "聽媽媽的話",
    "artist": "周杰倫",
    "year": "2006",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e1/61/42/e1614256-60b4-7cd9-809b-11da1506532f/23UM1IM59225.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": 45,
    "title": "寂寞沙洲冷",
    "artist": "周傳雄",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/db/8d/d9/db8dd92c-0610-cc60-e2af-48686a258ac9/196871143042.jpg/600x600bb.jpg"
  },
  {
    "id": 46,
    "title": "黃昏",
    "artist": "周傳雄",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/7f/86/09/7f86091b-bba1-7a6f-3d18-2791314c7e9f/dj.oujbidjn.jpg/600x600bb.jpg"
  },
  {
    "id": 47,
    "title": "零",
    "artist": "柯有倫",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/26/1e/14/261e14a4-a3e5-1dda-4889-a055e35b113f/828767239729.jpg/600x600bb.jpg"
  },
  {
    "id": 48,
    "title": "哭笑不得",
    "artist": "柯有綸",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/26/1e/14/261e14a4-a3e5-1dda-4889-a055e35b113f/828767239729.jpg/600x600bb.jpg"
  },
  {
    "id": 49,
    "title": "一個像夏天一個像秋天",
    "artist": "范瑋琪",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3d/e2/ba/3de2bae3-26f9-e6aa-4e31-ec183b547307/70217_cover.jpg/600x600bb.jpg"
  },
  {
    "id": 50,
    "title": "我們的紀念日",
    "artist": "范瑋琪",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/a7/7a/1ca77a4c-ed54-6a23-d314-072abda2a5df/asset.jpg/600x600bb.jpg"
  },
  {
    "id": 51,
    "title": "Superman",
    "artist": "倪子岡",
    "year": "2008",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ad/bb/ae/adbbae2d-a946-bf9c-3497-d3ea49fd13a4/888880687869.jpg/600x600bb.jpg"
  },
  {
    "id": 52,
    "title": "春泥",
    "artist": "庾澄慶",
    "year": "2003",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/a8/de/d9/mzi.crfnzjnu.jpg/600x600bb.jpg"
  },
  {
    "id": 53,
    "title": "海嘯",
    "artist": "庾澄慶",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b2/49/44/b24944a5-28a5-ffe9-a852-f3d5cdfc8054/mzi.mcskqzfu.jpg/600x600bb.jpg"
  },
  {
    "id": 54,
    "title": "情非得已",
    "artist": "庾澄慶",
    "year": "2001",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b2/49/44/b24944a5-28a5-ffe9-a852-f3d5cdfc8054/mzi.mcskqzfu.jpg/600x600bb.jpg"
  },
  {
    "id": 55,
    "title": "蛋炒飯",
    "artist": "庾澄慶",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/a8/de/d9/mzi.crfnzjnu.jpg/600x600bb.jpg"
  },
  {
    "id": 56,
    "title": "難以抗拒你容顏",
    "artist": "張信哲",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/98/fd/e8/98fde8f3-1ff6-d037-6053-b051461468ce/886444716215.jpg/600x600bb.jpg"
  },
  {
    "id": 57,
    "title": "維多利亞的秘密",
    "artist": "張惠妹",
    "year": "2007",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/87/a2/88/87a2887c-50dd-a435-da61-0f35f405abba/cover.jpg/600x600bb.jpg"
  },
  {
    "id": 58,
    "title": "喜歡",
    "artist": "張懸",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/6e/1b/84/6e1b84c8-1581-c1ff-e8a3-5c1b6a4f7eac/mzi.ckeidwej.jpg/600x600bb.jpg"
  },
  {
    "id": 59,
    "title": "寶貝",
    "artist": "張懸",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/2c/65/a6/mzi.gfyizvei.jpg/600x600bb.jpg"
  },
  {
    "id": 60,
    "title": "我不是你想的那麼勇敢",
    "artist": "梁文音",
    "year": "2008",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony60/300/300"
  },
  {
    "id": 61,
    "title": "如果沒有你",
    "artist": "莫文蔚",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony61/300/300"
  },
  {
    "id": 62,
    "title": "陰天",
    "artist": "莫文蔚",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony62/300/300"
  },
  {
    "id": 63,
    "title": "單人房雙人床",
    "artist": "莫文蔚",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony63/300/300"
  },
  {
    "id": 64,
    "title": "愛",
    "artist": "莫文蔚",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony64/300/300"
  },
  {
    "id": 65,
    "title": "男人女人",
    "artist": "許茹芸",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "團體/合唱",
    "albumArt": "https://picsum.photos/seed/sony65/300/300"
  },
  {
    "id": 66,
    "title": "下半輩子",
    "artist": "陳小春",
    "year": "2002",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony66/300/300"
  },
  {
    "id": 67,
    "title": "我愛的人",
    "artist": "陳小春",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony67/300/300"
  },
  {
    "id": 68,
    "title": "回味",
    "artist": "彭佳慧",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony68/300/300"
  },
  {
    "id": 69,
    "title": "走在紅毯那一天",
    "artist": "彭佳慧",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony69/300/300"
  },
  {
    "id": 70,
    "title": "喜歡兩個人",
    "artist": "彭佳慧",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony70/300/300"
  },
  {
    "id": 71,
    "title": "下沙",
    "artist": "游鴻明",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/3e/ac/86/mzi.ktxxkofn.jpg/600x600bb.jpg"
  },
  {
    "id": 72,
    "title": "詩人的眼淚",
    "artist": "游鴻明",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/32/ae/22/32ae228c-15f2-c2be-c627-91750ab850ea/dj.tmwtrled.jpg/600x600bb.jpg"
  },
  {
    "id": 73,
    "title": "戀上一個人",
    "artist": "游鴻明",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony73/300/300"
  },
  {
    "id": 74,
    "title": "那女孩對我說",
    "artist": "黃義達",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony74/300/300"
  },
  {
    "id": 75,
    "title": "藍天",
    "artist": "黃義達",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/f7/be/e8/mzi.xdpchppe.jpg/600x600bb.jpg"
  },
  {
    "id": 76,
    "title": "左邊",
    "artist": "楊丞琳",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/49/b3/d1/49b3d112-73e7-d758-49f6-b2951b0c1fd3/dj.bpkfhlxk.jpg/600x600bb.jpg"
  },
  {
    "id": 77,
    "title": "雨愛",
    "artist": "楊丞琳",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony77/300/300"
  },
  {
    "id": 78,
    "title": "缺氧",
    "artist": "楊丞琳",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony78/300/300"
  },
  {
    "id": 79,
    "title": "匿名的好友",
    "artist": "楊丞琳",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony79/300/300"
  },
  {
    "id": 80,
    "title": "帶我走",
    "artist": "楊丞琳",
    "year": "2008",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony80/300/300"
  },
  {
    "id": 81,
    "title": "理想情人",
    "artist": "楊丞琳",
    "year": "2005",
    "tempo": "輕快",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony81/300/300"
  },
  {
    "id": 82,
    "title": "遇上愛",
    "artist": "楊丞琳",
    "year": "2006",
    "tempo": "輕快",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony82/300/300"
  },
  {
    "id": 83,
    "title": "慶祝",
    "artist": "楊丞琳",
    "year": "2006",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/49/b3/d1/49b3d112-73e7-d758-49f6-b2951b0c1fd3/dj.bpkfhlxk.jpg/600x600bb.jpg"
  },
  {
    "id": 84,
    "title": "曖昧",
    "artist": "楊丞琳",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/56/01/e8/5601e8f0-f66a-357e-e2dd-7ed4016a203a/mzi.vlvftogr.jpg/600x600bb.jpg"
  },
  {
    "id": 85,
    "title": "獨立",
    "artist": "蜜雪薇琪",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "團體/合唱",
    "albumArt": "https://picsum.photos/seed/sony85/300/300"
  },
  {
    "id": 86,
    "title": "彩虹天堂",
    "artist": "劉畊宏",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony86/300/300"
  },
  {
    "id": 87,
    "title": "天空",
    "artist": "蔡依林",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony87/300/300"
  },
  {
    "id": 88,
    "title": "布拉格廣場",
    "artist": "蔡依林",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony88/300/300"
  },
  {
    "id": 89,
    "title": "我的依賴",
    "artist": "蔡依林",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/30/f0/87/mzi.fzslqkaz.jpg/600x600bb.jpg"
  },
  {
    "id": 90,
    "title": "招牌動作",
    "artist": "蔡依林",
    "year": "2004",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony90/300/300"
  },
  {
    "id": 91,
    "title": "看我七十二變",
    "artist": "蔡依林",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a2/f6/d2/a2f6d2ce-7a44-3c87-8774-556d6f30c565/dj.uxjggljv.jpg/600x600bb.jpg"
  },
  {
    "id": 92,
    "title": "倒帶",
    "artist": "蔡依林",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony92/300/300"
  },
  {
    "id": 93,
    "title": "特務J",
    "artist": "蔡依林",
    "year": "2007",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony93/300/300"
  },
  {
    "id": 94,
    "title": "野蠻遊戲",
    "artist": "蔡依林",
    "year": "2005",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony94/300/300"
  },
  {
    "id": 95,
    "title": "愛情三十六計",
    "artist": "蔡依林",
    "year": "2004",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony95/300/300"
  },
  {
    "id": 96,
    "title": "睜一隻眼一隻眼",
    "artist": "蔡依林",
    "year": "2005",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony96/300/300"
  },
  {
    "id": 97,
    "title": "說愛你",
    "artist": "蔡依林",
    "year": "2003",
    "tempo": "輕快",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony97/300/300"
  },
  {
    "id": 98,
    "title": "檸檬草的味道",
    "artist": "蔡依林",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony98/300/300"
  },
  {
    "id": 99,
    "title": "小乖乖",
    "artist": "蔡旻佑",
    "year": "2009",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony99/300/300"
  },
  {
    "id": 100,
    "title": "我可以",
    "artist": "蔡旻佑",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony100/300/300"
  },
  {
    "id": 101,
    "title": "早安晨之美",
    "artist": "盧廣仲",
    "year": "2008",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/e2/92/95/e2929549-0322-8277-749a-204abab3e4f6/box3-3cover_1400x1400.jpg/600x600bb.jpg"
  },
  {
    "id": 102,
    "title": "早知道．愛",
    "artist": "盧學叡",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/27/44/d2/mzi.whrbijib.jpg/600x600bb.jpg"
  },
  {
    "id": 103,
    "title": "阿飛的小蝴蝶",
    "artist": "蕭敬騰",
    "year": "2009",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony103/300/300"
  },
  {
    "id": 104,
    "title": "愛要坦蕩蕩",
    "artist": "蕭瀟",
    "year": "2003",
    "tempo": "輕快",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony104/300/300"
  },
  {
    "id": 105,
    "title": "空港",
    "artist": "戴愛玲",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony105/300/300"
  },
  {
    "id": 106,
    "title": "早點回家",
    "artist": "蘇打綠",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony106/300/300"
  },
  {
    "id": 107,
    "title": "藍眼睛",
    "artist": "蘇打綠",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "團體/合唱",
    "albumArt": "https://picsum.photos/seed/sony107/300/300"
  },
  {
    "id": 108,
    "title": "流星雨",
    "artist": "F4",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "團體/合唱",
    "albumArt": "https://picsum.photos/seed/sony108/300/300"
  },
  {
    "id": 109,
    "title": "第一時間",
    "artist": "F4",
    "year": "2001",
    "tempo": "輕快",
    "vocal": "團體/合唱",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f8/35/ac/f835aceb-ec67-69e3-fd68-9de33dd49240/dj.glnidttf.jpg/600x600bb.jpg"
  },
  {
    "id": 110,
    "title": "絕不能失去你",
    "artist": "F4",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "團體/合唱",
    "albumArt": "https://picsum.photos/seed/sony110/300/300"
  },
  {
    "id": 111,
    "title": "煙火的季節",
    "artist": "F4",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "團體/合唱",
    "albumArt": "https://picsum.photos/seed/sony111/300/300"
  }
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
  'songs_2026_02_13': songs_2026_02_13,
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
