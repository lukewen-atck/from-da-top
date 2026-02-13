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
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/56/80/80/5680800f-d526-fa0a-aead-0cab4df4699c/886446889665.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ee/17/70/ee17704b-781f-04c2-8f78-aafe2a4d98ea/mzaf_11206968360196468867.plus.aac.p.m4a"
  },
  {
    "id": 2,
    "title": "大城小愛",
    "artist": "王力宏",
    "year": "2005",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f9/82/88/f98288eb-ea32-6c8c-7919-357c31a4b437/1400X1400.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/07/55/0b/07550bf2-135f-d482-8995-fd252841d046/mzaf_13091770431436843848.plus.aac.p.m4a"
  },
  {
    "id": 3,
    "title": "心中的日月",
    "artist": "王力宏",
    "year": "2004",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Features/c2/0c/44/dj.smpllcgy.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/4f/2f/17/4f2f1729-00dd-e4f3-bd3a-6da57d8f60e9/mzaf_14259743006460159727.plus.aac.p.m4a"
  },
  {
    "id": 4,
    "title": "如果你聽見我的歌",
    "artist": "王力宏",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/4e/cf/db/mzi.ypabaoxf.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/4d/a4/6b/4da46bc0-345b-ebed-3dbb-1d569b4b732c/mzaf_11552347666548794544.plus.aac.p.m4a"
  },
  {
    "id": 5,
    "title": "你不在",
    "artist": "王力宏",
    "year": "2003",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/1f/c2/bf1fc215-9240-cb99-ef57-ad2dd855610a/dj.tlgtqqag.png/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2b/ed/77/2bed7701-734e-9142-72a9-94a29f08a532/mzaf_12565971087468505196.plus.aac.p.m4a"
  },
  {
    "id": 6,
    "title": "我們的歌",
    "artist": "王力宏",
    "year": "2007",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d6/d1/bb/d6d1bb74-e2d3-743e-f514-5668390c4d67/gaibianziji_fengmian.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/c5/93/ea/c593ea0a-616f-b50f-0b64-f4d27d911941/mzaf_17312099652343676583.plus.aac.p.m4a"
  },
  {
    "id": 7,
    "title": "依然愛你",
    "artist": "王力宏",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c3/5d/3b/c35d3b17-40cd-f24c-d72b-1f2a6099c6e9/Open_Fire_cover.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/fa/5b/20/fa5b20bb-8ce4-f894-5ff1-af845b803cc9/mzaf_5875091299982094218.plus.aac.p.m4a"
  },
  {
    "id": 8,
    "title": "放開你的心",
    "artist": "王力宏",
    "year": "2004",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Features/c2/0c/44/dj.smpllcgy.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/44/72/26/447226dc-7cd9-92ff-ddda-b0fa1d850245/mzaf_15529375254032903383.plus.aac.p.m4a"
  },
  {
    "id": 9,
    "title": "花田錯",
    "artist": "王力宏",
    "year": "2005",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f9/82/88/f98288eb-ea32-6c8c-7919-357c31a4b437/1400X1400.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/4a/fd/9b/4afd9ba7-e0a8-84fb-115e-ee62638e125c/mzaf_3013998573688034577.plus.aac.p.m4a"
  },
  {
    "id": 10,
    "title": "唯一",
    "artist": "王力宏",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/48/fd/2f/48fd2fe5-31b2-d979-53a4-9aebf5175bdb/mzi.biqraozb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/d6/e2/c0/d6e2c072-ce35-ba93-d069-c2f0feec3f55/mzaf_17040525657257394092.plus.aac.p.m4a"
  },
  {
    "id": 11,
    "title": "愛的就是你",
    "artist": "王力宏",
    "year": "2001",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/48/fd/2f/48fd2fe5-31b2-d979-53a4-9aebf5175bdb/mzi.biqraozb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/73/e3/36/73e33622-9969-69e7-8dd0-c995db315cd6/mzaf_4527012698282220195.plus.aac.p.m4a"
  },
  {
    "id": 12,
    "title": "愛錯",
    "artist": "王力宏",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/be/4a/77/be4a7730-c144-a39e-c7b6-9d26ea0ebff3/1400X1400.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/5b/da/44/5bda4407-0e63-533b-b23f-e93d4f0adae5/mzaf_11231425034437073159.plus.aac.p.m4a"
  },
  {
    "id": 13,
    "title": "落葉歸根",
    "artist": "王力宏",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d6/d1/bb/d6d1bb74-e2d3-743e-f514-5668390c4d67/gaibianziji_fengmian.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/09/4b/b3/094bb3e0-a359-d0fb-c01d-764355f66e46/mzaf_14466558170217072033.plus.aac.p.m4a"
  },
  {
    "id": 14,
    "title": "Kiss Goodbye",
    "artist": "王力宏",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f9/82/88/f98288eb-ea32-6c8c-7919-357c31a4b437/1400X1400.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/d5/ca/38/d5ca38f4-190b-6a35-9097-73fcc86140b1/mzaf_9235055949686369276.plus.aac.p.m4a"
  },
  {
    "id": 15,
    "title": "W-H-Y",
    "artist": "王力宏",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Features/c2/0c/44/dj.smpllcgy.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/d8/fa/10/d8fa10e9-40f9-4749-458a-e52bdfdade93/mzaf_3868087132918431472.plus.aac.p.m4a"
  },
  {
    "id": 16,
    "title": "心電心",
    "artist": "王心凌",
    "year": "2009",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/ec/b5/3f/ecb53fef-904b-89b5-1a38-7e402f053007/196871423175.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/70/0b/9c/700b9c43-8e31-9ebe-c344-f03b254dca7f/mzaf_13756003072295059424.plus.aac.p.m4a"
  },
  {
    "id": 17,
    "title": "青春紀念冊",
    "artist": "可米小子",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "團體/合唱",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b9/41/93/b941939c-84e2-b8cf-5099-7698d1a5fb40/mzi.ynielmpd.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/9c/46/7e/9c467e14-c6dd-f6df-e667-344457880406/mzaf_4013061681158171381.plus.aac.p.m4a"
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
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/6d/80/35/6d8035bf-86e1-9f6d-6afe-e83660e28a65/mzi.zhoaufjn.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/01/d9/c2/01d9c28e-8723-987e-5d5f-f1908e7c7073/mzaf_10145957067084508395.plus.aac.p.m4a"
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
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0e/7f/b7/0e7fb735-0898-7a99-3fc3-e23913cce413/886447846575.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/fe/45/67/fe456787-dd6d-bc47-f4c8-b11b75ad28c5/mzaf_11886289344956338076.plus.aac.p.m4a"
  },
  {
    "id": 22,
    "title": "一公尺",
    "artist": "言承旭",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/3d/6b/88/mzi.jpzngnqo.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/fe/66/68/fe666831-f958-0f17-9bb7-d64c960d3ce9/mzaf_17349361558069056143.plus.aac.p.m4a"
  },
  {
    "id": 23,
    "title": "我會很愛你",
    "artist": "言承旭",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/71/50/b5/7150b5f4-e441-4b4c-255f-724d91e63535/mzi.algikrvk.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/1c/6f/18/1c6f18e5-1dd7-789f-9a75-54d5cb718430/mzaf_13012785474849032834.plus.aac.p.m4a"
  },
  {
    "id": 24,
    "title": "七里香",
    "artist": "周杰倫",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/58/8d/6d/588d6d61-fbac-148a-86bd-0030ce076ac1/23UM1IM57281.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/20/86/b8/2086b87c-251f-4654-58e4-3e781a4d1f27/mzaf_7055097530578252700.plus.aac.p.m4a"
  },
  {
    "id": 25,
    "title": "千里之外",
    "artist": "周杰倫",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/1c/10/ad/1c10ad86-a96c-15e4-f809-360f53011b04/23UM1IM58801.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/9e/e7/98/9ee7981d-ec8b-5932-4f73-77fd69a45eda/mzaf_697376794564064408.plus.aac.p.m4a"
  },
  {
    "id": 26,
    "title": "牛仔很忙",
    "artist": "周杰倫",
    "year": "2007",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f7/2c/9f/f72c9fc6-c4dc-d6a0-4386-0478b09cb797/23UM1IM58609.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/ab/95/04/ab95047f-6e2e-24e1-b2ee-e966c0914672/mzaf_13272354903316209122.plus.aac.p.m4a"
  },
  {
    "id": 27,
    "title": "以父之名",
    "artist": "周杰倫",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8c/47/86/8c47862d-e254-8b49-30cf-d1f05ebba05b/23UM1IM56855.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/86/44/ef/8644ef0a-2efd-bc41-9be5-b71bcbe6c646/mzaf_18197836011621994241.plus.aac.p.m4a"
  },
  {
    "id": 28,
    "title": "可愛女人",
    "artist": "周杰倫",
    "year": "2000",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/69/f7/7f/69f77f5e-9b36-917e-cf15-7bd8442572c7/23UM1IM56109.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/b7/1a/3a/b71a3a09-1246-1548-bf8d-a8e8071baad4/mzaf_350011175892995924.plus.aac.p.m4a"
  },
  {
    "id": 29,
    "title": "回到過去",
    "artist": "周杰倫",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/14/b9/fa/14b9fa3f-ef0c-01de-3721-93ff740062b5/23UM1IM56711.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/9e/a1/d4/9ea1d473-a4d6-beb0-a93e-9f7fa95ae96e/mzaf_14614076832458351999.plus.aac.p.m4a"
  },
  {
    "id": 30,
    "title": "安靜",
    "artist": "周杰倫",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/14/b9/fa/14b9fa3f-ef0c-01de-3721-93ff740062b5/23UM1IM56711.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/1b/7f/d8/1b7fd8e1-c945-5230-5276-8f7930a709b9/mzaf_5492907910166216834.plus.aac.p.m4a"
  },
  {
    "id": 31,
    "title": "夜曲",
    "artist": "周杰倫",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/69/49/61/694961f3-1414-355e-66e4-9649ba13ec55/23UM1IM57770.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/0e/f2/00/0ef200dd-c5aa-f406-2f21-f4724ae74350/mzaf_6826807524179655467.plus.aac.p.m4a"
  },
  {
    "id": 32,
    "title": "青花瓷",
    "artist": "周杰倫",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f7/2c/9f/f72c9fc6-c4dc-d6a0-4386-0478b09cb797/23UM1IM58609.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/e7/2a/12/e72a12e3-f2f8-5ecb-15d7-54aab7100ee8/mzaf_2373538062810778845.plus.aac.p.m4a"
  },
  {
    "id": 33,
    "title": "威廉古堡",
    "artist": "周杰倫",
    "year": "2001",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/14/b9/fa/14b9fa3f-ef0c-01de-3721-93ff740062b5/23UM1IM56711.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/b6/f1/2d/b6f12d22-bba4-9685-e6be-30494ae8b5f3/mzaf_7671145019118107973.plus.aac.p.m4a"
  },
  {
    "id": 34,
    "title": "晴天",
    "artist": "周杰倫",
    "year": "2003",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8c/47/86/8c47862d-e254-8b49-30cf-d1f05ebba05b/23UM1IM56855.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/c2/0f/17/c20f1776-d243-3a88-92f0-75dc2875afad/mzaf_12161707105778039594.plus.aac.p.m4a"
  },
  {
    "id": 35,
    "title": "黑色幽默",
    "artist": "周杰倫",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/69/f7/7f/69f77f5e-9b36-917e-cf15-7bd8442572c7/23UM1IM56109.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/34/2b/4a/342b4a95-e5bc-a74c-7676-f178d7145e92/mzaf_1132860217115228157.plus.aac.p.m4a"
  },
  {
    "id": 36,
    "title": "愛在西元前",
    "artist": "周杰倫",
    "year": "2001",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony36/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/5b/f9/18/5bf918b8-a4b0-ce89-8c4b-1ed682a51e8c/mzaf_2529843122965358541.plus.aac.p.m4a"
  },
  {
    "id": 37,
    "title": "說好的幸福呢",
    "artist": "周杰倫",
    "year": "2008",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony37/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a2/92/52/a29252ca-34fc-73b9-d49a-602d14e1dbe7/mzaf_2363681558363922129.plus.aac.p.m4a"
  },
  {
    "id": 38,
    "title": "稻香",
    "artist": "周杰倫",
    "year": "2008",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony38/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/2e/99/24/2e99240d-aae9-1c6b-8ef8-03e5640a1815/mzaf_10779055084387930793.plus.aac.p.m4a"
  },
  {
    "id": 39,
    "title": "龍捲風",
    "artist": "周杰倫",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2b/09/2c/2b092c5a-2e54-149c-9984-b3139bc35b1f/23UM1IM59801.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0a/2e/44/0a2e4456-6173-3f30-c853-2aa8e8921211/mzaf_17216900505675553528.plus.aac.p.m4a"
  },
  {
    "id": 40,
    "title": "龍戰騎士",
    "artist": "周杰倫",
    "year": "2008",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/53/6c/72/536c7219-e177-a912-9322-e1abf70e8733/23UM1IM58828.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/f4/15/b8/f415b809-d5ba-81ff-f70e-aff4aa1acdf5/mzaf_6434784289113296856.plus.aac.p.m4a"
  },
  {
    "id": 41,
    "title": "簡單愛",
    "artist": "周杰倫",
    "year": "2001",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/14/b9/fa/14b9fa3f-ef0c-01de-3721-93ff740062b5/23UM1IM56711.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/0e/a8/c3/0ea8c309-16ca-f5e6-c2aa-19f791f14b0e/mzaf_6564540559162857421.plus.aac.p.m4a"
  },
  {
    "id": 42,
    "title": "雙截棍",
    "artist": "周杰倫",
    "year": "2001",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/52/f8/f5/52f8f5a7-1a1e-3491-16bd-240914fb60c8/23UM1IM59705.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/16/e4/18/16e418d4-76dd-86ad-cae0-8fe131a7b8a3/mzaf_1991305808313039402.plus.aac.p.m4a"
  },
  {
    "id": 43,
    "title": "蘭亭序",
    "artist": "周杰倫",
    "year": "2008",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/53/6c/72/536c7219-e177-a912-9322-e1abf70e8733/23UM1IM58828.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/00/a7/07/00a70702-8d36-bdf0-1209-9c4738229501/mzaf_4591781521662834672.plus.aac.p.m4a"
  },
  {
    "id": 44,
    "title": "聽媽媽的話",
    "artist": "周杰倫",
    "year": "2006",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e1/61/42/e1614256-60b4-7cd9-809b-11da1506532f/23UM1IM59225.rgb.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/40/79/a3/4079a36a-6e7c-cb47-cc3c-a7124e9369bc/mzaf_12415227672732226388.plus.aac.p.m4a"
  },
  {
    "id": 45,
    "title": "寂寞沙洲冷",
    "artist": "周傳雄",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/db/8d/d9/db8dd92c-0610-cc60-e2af-48686a258ac9/196871143042.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/0a/f9/74/0af97478-95b9-dcd0-d972-f597b4a286ac/mzaf_14536718485678523626.plus.aac.p.m4a"
  },
  {
    "id": 46,
    "title": "黃昏",
    "artist": "周傳雄",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/7f/86/09/7f86091b-bba1-7a6f-3d18-2791314c7e9f/dj.oujbidjn.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/69/5b/fd/695bfda3-12cb-b978-ac91-d0181e6262b6/mzaf_3455044102767280923.plus.aac.p.m4a"
  },
  {
    "id": 47,
    "title": "零",
    "artist": "柯有倫",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/26/1e/14/261e14a4-a3e5-1dda-4889-a055e35b113f/828767239729.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/4e/65/15/4e651588-5706-d8d9-c7df-6db3bced0f78/mzaf_3767456334726346079.plus.aac.p.m4a"
  },
  {
    "id": 48,
    "title": "哭笑不得",
    "artist": "柯有綸",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/26/1e/14/261e14a4-a3e5-1dda-4889-a055e35b113f/828767239729.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/79/1e/f2/791ef2e4-433a-a801-c66d-2afc442189b3/mzaf_12731863639642168590.plus.aac.p.m4a"
  },
  {
    "id": 49,
    "title": "一個像夏天一個像秋天",
    "artist": "范瑋琪",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3d/e2/ba/3de2bae3-26f9-e6aa-4e31-ec183b547307/70217_cover.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/a4/bc/f2/a4bcf2ac-508b-6333-79a6-bed547ca6485/mzaf_3868527889735816523.plus.aac.p.m4a"
  },
  {
    "id": 50,
    "title": "我們的紀念日",
    "artist": "范瑋琪",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/a7/7a/1ca77a4c-ed54-6a23-d314-072abda2a5df/asset.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/51/65/ae/5165aecc-c261-f172-a135-f5800a5748c6/mzaf_9987997309102293410.plus.aac.p.m4a"
  },
  {
    "id": 51,
    "title": "Superman",
    "artist": "倪子岡",
    "year": "2008",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ad/bb/ae/adbbae2d-a946-bf9c-3497-d3ea49fd13a4/888880687869.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/90/8d/db/908ddba8-9482-6c1b-9bfe-ded8cdb15067/mzaf_12000841580063447390.plus.aac.p.m4a"
  },
  {
    "id": 52,
    "title": "春泥",
    "artist": "庾澄慶",
    "year": "2003",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/a8/de/d9/mzi.crfnzjnu.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/9a/f6/6f/9af66fff-63a8-5bee-bf3f-fb2b32489fcc/mzaf_2650874691533823578.plus.aac.p.m4a"
  },
  {
    "id": 53,
    "title": "海嘯",
    "artist": "庾澄慶",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b2/49/44/b24944a5-28a5-ffe9-a852-f3d5cdfc8054/mzi.mcskqzfu.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/c9/ed/47/c9ed47f3-eb94-0f3e-1997-6b46965069d4/mzaf_1559475152040865638.plus.aac.p.m4a"
  },
  {
    "id": 54,
    "title": "情非得已",
    "artist": "庾澄慶",
    "year": "2001",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b2/49/44/b24944a5-28a5-ffe9-a852-f3d5cdfc8054/mzi.mcskqzfu.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a5/65/b8/a565b869-084f-f3a3-48b3-7a0a893bec17/mzaf_15315259212354461699.plus.aac.p.m4a"
  },
  {
    "id": 55,
    "title": "蛋炒飯",
    "artist": "庾澄慶",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/a8/de/d9/mzi.crfnzjnu.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/d0/ed/ac/d0edac31-4f0b-e515-1832-8c29c820c765/mzaf_11222447066470990252.plus.aac.p.m4a"
  },
  {
    "id": 56,
    "title": "難以抗拒你容顏",
    "artist": "張信哲",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/98/fd/e8/98fde8f3-1ff6-d037-6053-b051461468ce/886444716215.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/94/de/ae/94deaee6-5766-8838-d3e7-67f7b57c117f/mzaf_14733500737316994273.plus.aac.p.m4a"
  },
  {
    "id": 57,
    "title": "維多利亞的秘密",
    "artist": "張惠妹",
    "year": "2007",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/87/a2/88/87a2887c-50dd-a435-da61-0f35f405abba/cover.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5b/c9/40/5bc94021-7c10-e3c5-e9e4-be0d8fbb1bd9/mzaf_14974905543121801186.plus.aac.p.m4a"
  },
  {
    "id": 58,
    "title": "喜歡",
    "artist": "張懸",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/6e/1b/84/6e1b84c8-1581-c1ff-e8a3-5c1b6a4f7eac/mzi.ckeidwej.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0c/1b/57/0c1b57e4-a5b0-c553-d206-7a835d8ffda3/mzaf_3700129911994101444.plus.aac.p.m4a"
  },
  {
    "id": 59,
    "title": "寶貝",
    "artist": "張懸",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/2c/65/a6/mzi.gfyizvei.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/26/bb/c8/26bbc8d3-b49e-3a39-e0a1-33ac64c70b8a/mzaf_1073341218209145463.plus.aac.p.m4a"
  },
  {
    "id": 60,
    "title": "我不是你想的那麼勇敢",
    "artist": "梁文音",
    "year": "2008",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony60/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b6/93/87/b693879c-1d47-31c8-94c1-575fcbd8179c/mzaf_5899645193124934119.plus.aac.p.m4a"
  },
  {
    "id": 61,
    "title": "如果沒有你",
    "artist": "莫文蔚",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony61/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/56/29/7c/56297cfa-bcbe-793c-a3b6-4dc44a730083/mzaf_8238337052627340663.plus.aac.p.m4a"
  },
  {
    "id": 62,
    "title": "陰天",
    "artist": "莫文蔚",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony62/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/5f/c3/b6/5fc3b6c9-7ca2-e860-904f-5961a4643da9/mzaf_11891323176959043970.plus.aac.p.m4a"
  },
  {
    "id": 63,
    "title": "單人房雙人床",
    "artist": "莫文蔚",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony63/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/25/73/48/257348e6-64dc-c07e-0764-e839f9497e5d/mzaf_10602879035819482013.plus.aac.p.m4a"
  },
  {
    "id": 64,
    "title": "愛",
    "artist": "莫文蔚",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony64/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/99/b5/ea/99b5eac9-f789-5a26-a1c0-b32ae9c9d729/mzaf_10806018209387166476.plus.aac.p.m4a"
  },
  {
    "id": 65,
    "title": "男人女人",
    "artist": "許茹芸",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "團體/合唱",
    "albumArt": "https://picsum.photos/seed/sony65/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d9/47/8d/d9478dfe-5d07-b2be-ffc2-2dca91b9a50d/mzaf_3777674077925627605.plus.aac.p.m4a"
  },
  {
    "id": 66,
    "title": "下半輩子",
    "artist": "陳小春",
    "year": "2002",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony66/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/d7/dd/8b/d7dd8b02-1dec-f9aa-0762-47de6973460b/mzaf_9134420502065068087.plus.aac.p.m4a"
  },
  {
    "id": 67,
    "title": "我愛的人",
    "artist": "陳小春",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony67/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/28/13/e8/2813e87a-0c76-8050-597a-ade49b0fe77f/mzaf_18081175160122836074.plus.aac.p.m4a"
  },
  {
    "id": 68,
    "title": "回味",
    "artist": "彭佳慧",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony68/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/a3/09/9a/a3099aab-0012-6f63-3e31-7ef02baf5002/mzaf_7683194943873526546.plus.aac.p.m4a"
  },
  {
    "id": 69,
    "title": "走在紅毯那一天",
    "artist": "彭佳慧",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony69/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/50/04/44/5004447d-5173-66e0-c111-c6b616215c16/mzaf_11738256404896026208.plus.aac.p.m4a"
  },
  {
    "id": 70,
    "title": "喜歡兩個人",
    "artist": "彭佳慧",
    "year": "2001",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony70/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b6/20/b7/b620b7ac-e36f-0ef9-e5d9-918c5a1fa1b0/mzaf_8697597772889293148.plus.aac.p.m4a"
  },
  {
    "id": 71,
    "title": "下沙",
    "artist": "游鴻明",
    "year": "2000",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/3e/ac/86/mzi.ktxxkofn.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0f/f4/75/0ff475b0-4f2d-531a-4a95-faf9ade50608/mzaf_7548297397335953684.plus.aac.p.m4a"
  },
  {
    "id": 72,
    "title": "詩人的眼淚",
    "artist": "游鴻明",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/32/ae/22/32ae228c-15f2-c2be-c627-91750ab850ea/dj.tmwtrled.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ce/88/2a/ce882ada-9550-fb32-d27b-45ab9b1f6f4e/mzaf_14508445721772626034.plus.aac.p.m4a"
  },
  {
    "id": 73,
    "title": "戀上一個人",
    "artist": "游鴻明",
    "year": "2002",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony73/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a0/6b/fb/a06bfbeb-8a0e-a6a4-1bee-5f9b60f366f0/mzaf_6787456009614434421.plus.aac.p.m4a"
  },
  {
    "id": 74,
    "title": "那女孩對我說",
    "artist": "黃義達",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony74/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/86/a1/9d/86a19d49-290c-996f-d450-02b981e65c12/mzaf_11599632864646193799.plus.aac.p.m4a"
  },
  {
    "id": 75,
    "title": "藍天",
    "artist": "黃義達",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/f7/be/e8/mzi.xdpchppe.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/c9/b1/69/c9b1697f-a97f-4356-4992-2f1ddf4920bf/mzaf_12653158809221026987.plus.aac.p.m4a"
  },
  {
    "id": 76,
    "title": "左邊",
    "artist": "楊丞琳",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/49/b3/d1/49b3d112-73e7-d758-49f6-b2951b0c1fd3/dj.bpkfhlxk.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/db/67/2d/db672ddd-1545-ac3f-4a3b-72a2dc5e4a7f/mzaf_320714892245353876.plus.aac.p.m4a"
  },
  {
    "id": 77,
    "title": "雨愛",
    "artist": "楊丞琳",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony77/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1d/2d/d7/1d2dd774-0bb2-2a60-3a1c-3d28932ccba1/mzaf_17813447189860212946.plus.aac.p.m4a"
  },
  {
    "id": 78,
    "title": "缺氧",
    "artist": "楊丞琳",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony78/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f5/a0/6d/f5a06d43-cc2f-4df4-4e21-7d2686c6f134/mzaf_17675232290288509249.plus.aac.p.m4a"
  },
  {
    "id": 79,
    "title": "匿名的好友",
    "artist": "楊丞琳",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony79/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/14/a2/db/14a2db6b-f798-9973-c858-608ffab6455d/mzaf_5254891004187359022.plus.aac.p.m4a"
  },
  {
    "id": 80,
    "title": "帶我走",
    "artist": "楊丞琳",
    "year": "2008",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony80/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0c/92/43/0c92434c-91dc-a4ab-6228-e8e007de9564/mzaf_7504094442999028617.plus.aac.p.m4a"
  },
  {
    "id": 81,
    "title": "理想情人",
    "artist": "楊丞琳",
    "year": "2005",
    "tempo": "輕快",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony81/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ee/43/dc/ee43dc35-53d4-4e67-47d7-9510d80c0f76/mzaf_14574309864219078816.plus.aac.p.m4a"
  },
  {
    "id": 82,
    "title": "遇上愛",
    "artist": "楊丞琳",
    "year": "2006",
    "tempo": "輕快",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony82/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bf/d0/ec/bfd0ec13-5da1-4138-c174-95cc1f160c82/mzaf_12207687574904333313.plus.aac.p.m4a"
  },
  {
    "id": 83,
    "title": "慶祝",
    "artist": "楊丞琳",
    "year": "2006",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/49/b3/d1/49b3d112-73e7-d758-49f6-b2951b0c1fd3/dj.bpkfhlxk.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/89/f2/e0/89f2e095-a4a0-af27-ce63-60fd3e5544da/mzaf_6497112260739274240.plus.aac.p.m4a"
  },
  {
    "id": 84,
    "title": "曖昧",
    "artist": "楊丞琳",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/56/01/e8/5601e8f0-f66a-357e-e2dd-7ed4016a203a/mzi.vlvftogr.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b2/b1/0e/b2b10ec2-2e1e-89de-6214-1aa7408b46c4/mzaf_6737920961558847045.plus.aac.p.m4a"
  },
  {
    "id": 85,
    "title": "獨立",
    "artist": "蜜雪薇琪",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "團體/合唱",
    "albumArt": "https://picsum.photos/seed/sony85/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/75/e1/61/75e161e2-c53b-01e5-7c60-6ac46a39088e/mzaf_4069956401067725071.plus.aac.p.m4a"
  },
  {
    "id": 86,
    "title": "彩虹天堂",
    "artist": "劉畊宏",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony86/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/8a/d9/fd/8ad9fd32-01af-f373-46d4-a1030ae00fd6/mzaf_6720465195218817943.plus.aac.p.m4a"
  },
  {
    "id": 87,
    "title": "天空",
    "artist": "蔡依林",
    "year": "2005",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony87/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/df/33/a9/df33a97e-8049-de04-517b-6becc4d3d037/mzaf_3460289279573172523.plus.aac.p.m4a"
  },
  {
    "id": 88,
    "title": "布拉格廣場",
    "artist": "蔡依林",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony88/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0f/41/98/0f419873-6823-9abf-103f-f3a85f713325/mzaf_17608574902624931862.plus.aac.p.m4a"
  },
  {
    "id": 89,
    "title": "我的依賴",
    "artist": "蔡依林",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/30/f0/87/mzi.fzslqkaz.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/54/39/8c/54398caf-8464-4560-5a65-b2f48e84787c/mzaf_11725258832659685596.plus.aac.p.m4a"
  },
  {
    "id": 90,
    "title": "招牌動作",
    "artist": "蔡依林",
    "year": "2004",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony90/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/db/e7/50/dbe750b6-ef51-30f8-adc5-8a4ee2190889/mzaf_250309415100156273.plus.aac.p.m4a"
  },
  {
    "id": 91,
    "title": "看我七十二變",
    "artist": "蔡依林",
    "year": "2003",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a2/f6/d2/a2f6d2ce-7a44-3c87-8774-556d6f30c565/dj.uxjggljv.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/61/d2/81/61d28126-207b-8632-372a-57f8173cca65/mzaf_17277060745612341719.plus.aac.p.m4a"
  },
  {
    "id": 92,
    "title": "倒帶",
    "artist": "蔡依林",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony92/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/77/07/27/7707275b-ba7f-0889-72a2-94e9e822572d/mzaf_18386160249744541319.plus.aac.p.m4a"
  },
  {
    "id": 93,
    "title": "特務J",
    "artist": "蔡依林",
    "year": "2007",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony93/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/98/74/f9/9874f9dc-3774-1ec3-d07d-12bea3ca2381/mzaf_14495317873290155816.plus.aac.p.m4a"
  },
  {
    "id": 94,
    "title": "野蠻遊戲",
    "artist": "蔡依林",
    "year": "2005",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony94/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/30/37/98/30379814-7860-0889-dcb8-d7ddc433212e/mzaf_16990360185037820787.plus.aac.p.m4a"
  },
  {
    "id": 95,
    "title": "愛情三十六計",
    "artist": "蔡依林",
    "year": "2004",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony95/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/76/8e/ff/768effc5-97c4-695b-0eeb-90c87e4034ab/mzaf_15412782134961942412.plus.aac.p.m4a"
  },
  {
    "id": 96,
    "title": "睜一隻眼一隻眼",
    "artist": "蔡依林",
    "year": "2005",
    "tempo": "快歌",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony96/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c6/2c/92/c62c9245-5795-b5d0-75b7-b386c2772ffc/mzaf_6347943038441296898.plus.aac.p.m4a"
  },
  {
    "id": 97,
    "title": "說愛你",
    "artist": "蔡依林",
    "year": "2003",
    "tempo": "輕快",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony97/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/76/d7/b1/76d7b103-a466-31a3-d3f7-43e5c3bb5f4f/mzaf_8499867377798423984.plus.aac.p.m4a"
  },
  {
    "id": 98,
    "title": "檸檬草的味道",
    "artist": "蔡依林",
    "year": "2004",
    "tempo": "抒情",
    "vocal": "女生",
    "albumArt": "https://picsum.photos/seed/sony98/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/44/94/1b/44941b6e-9199-6454-8cb4-5f6e6ff37f79/mzaf_5388208469385089738.plus.aac.p.m4a"
  },
  {
    "id": 99,
    "title": "小乖乖",
    "artist": "蔡旻佑",
    "year": "2009",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony99/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/db/68/65/db686534-d741-7128-f397-2d80d965e807/mzaf_15298948877675738514.plus.aac.p.m4a"
  },
  {
    "id": 100,
    "title": "我可以",
    "artist": "蔡旻佑",
    "year": "2006",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony100/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/5e/3a/16/5e3a1605-5717-4cea-206f-b90b8ad7670a/mzaf_6793353445625287444.plus.aac.p.m4a"
  },
  {
    "id": 101,
    "title": "早安晨之美",
    "artist": "盧廣仲",
    "year": "2008",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/e2/92/95/e2929549-0322-8277-749a-204abab3e4f6/box3-3cover_1400x1400.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/d6/db/45/d6db45ac-f9e5-dc5d-f0ef-9c28615478d8/mzaf_8073901110118965318.plus.aac.p.m4a"
  },
  {
    "id": 102,
    "title": "早知道．愛",
    "artist": "盧學叡",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music/27/44/d2/mzi.whrbijib.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/16/4d/b5/164db5c5-3d22-5a70-93fa-624c51c31632/mzaf_6397591932492392747.plus.aac.p.m4a"
  },
  {
    "id": 103,
    "title": "阿飛的小蝴蝶",
    "artist": "蕭敬騰",
    "year": "2009",
    "tempo": "輕快",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony103/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/86/1e/83861e22-c277-d231-9270-e90bd0c8cc28/mzaf_17124966460844948968.plus.aac.p.m4a"
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
    "albumArt": "https://picsum.photos/seed/sony105/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/3a/3f/c2/3a3fc2b2-5b48-3b5b-a536-50e2f58f5aef/mzaf_10621041315015039636.plus.aac.p.m4a"
  },
  {
    "id": 106,
    "title": "早點回家",
    "artist": "蘇打綠",
    "year": "2009",
    "tempo": "抒情",
    "vocal": "男生",
    "albumArt": "https://picsum.photos/seed/sony106/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/58/d6/09/58d609cb-5d09-6a3c-f76f-39fac6047e0e/mzaf_12651442601664634766.plus.aac.p.m4a"
  },
  {
    "id": 107,
    "title": "藍眼睛",
    "artist": "蘇打綠",
    "year": "2007",
    "tempo": "抒情",
    "vocal": "團體/合唱",
    "albumArt": "https://picsum.photos/seed/sony107/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/68/91/9c/68919c48-492d-a2d3-657f-ee3d24537f7e/mzaf_5136213134197419844.plus.aac.p.m4a"
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
    "albumArt": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f8/35/ac/f835aceb-ec67-69e3-fd68-9de33dd49240/dj.glnidttf.jpg/600x600bb.jpg",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/c6/65/5e/c6655ecf-8cc8-8ebf-baf0-bfc576ec90fc/mzaf_2210009277818082136.plus.aac.p.m4a"
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
    "albumArt": "https://picsum.photos/seed/sony111/300/300",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/d2/e1/59/d2e159a3-b87b-a532-083b-4f269617a4fa/mzaf_390825474058782296.plus.aac.p.m4a"
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
