// 官方任務池
export const officialTasks = [
  {
    id: 'first_reaction',
    name: 'First Reaction',
    subtitle: '第一反應',
    description: `打開鏡頭，看到你抽到的歌曲名稱後，
說出你當下最真實的一句話。
不需要演唱，只要反應。`,
    specs: {
      minDuration: 10,
      maxDuration: 15,
      aspectRatio: '9:16',
      notes: [
        '影片長度：10–15 秒',
        '直式影片（9:16）',
        '不需剪輯、不需配樂',
        '語言不限（中文為主）',
      ],
    },
    icon: '🎬',
  },
  {
    id: 'that_one_line',
    name: 'That One Line',
    subtitle: '腦中那一句',
    description: `唱出你一看到這首歌時，
腦中第一句浮現的歌詞。
不限 Key、不需完整。`,
    specs: {
      minDuration: 5,
      maxDuration: 10,
      aspectRatio: '9:16',
      notes: [
        '影片長度：5–10 秒',
        '只需一句',
        '失誤可接受',
        '不需完整翻唱',
      ],
    },
    icon: '🎤',
  },
  {
    id: 'one_word_emoji',
    name: 'One Word / One Emoji',
    subtitle: '一個詞或一個 Emoji',
    description: `用一個詞，或一個 emoji，
形容這首歌帶給你的感覺。`,
    specs: {
      minDuration: 5,
      maxDuration: 8,
      aspectRatio: '9:16',
      notes: [
        '影片長度：5–8 秒',
        '說完即可',
        '不需演唱',
      ],
    },
    icon: '💬',
  },
];

// 隨機選取一個任務
export function getRandomTask() {
  const randomIndex = Math.floor(Math.random() * officialTasks.length);
  return officialTasks[randomIndex];
}

// 根據 ID 獲取任務
export function getTaskById(taskId) {
  return officialTasks.find(task => task.id === taskId);
}

// 驗證影片規格
export function validateVideoSpecs(file, task) {
  return new Promise((resolve, reject) => {
    // 檢查檔案格式
    const validFormats = ['video/mp4', 'video/quicktime', 'video/mov'];
    if (!validFormats.includes(file.type)) {
      reject({ code: 'INVALID_FORMAT', message: '請上傳 MP4 或 MOV 格式的影片' });
      return;
    }

    // 檢查檔案大小 (最大 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      reject({ code: 'FILE_TOO_LARGE', message: '影片檔案不可超過 100MB' });
      return;
    }

    // 創建影片元素檢查時長
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      
      const duration = video.duration;
      const { minDuration, maxDuration } = task.specs;

      if (duration < minDuration) {
        reject({ 
          code: 'TOO_SHORT', 
          message: `影片太短！最少需要 ${minDuration} 秒，目前只有 ${Math.round(duration)} 秒` 
        });
        return;
      }

      if (duration > maxDuration + 2) { // 給 2 秒緩衝
        reject({ 
          code: 'TOO_LONG', 
          message: `影片太長！最多 ${maxDuration} 秒，目前有 ${Math.round(duration)} 秒` 
        });
        return;
      }

      // 檢查影片尺寸（直式 9:16）
      const width = video.videoWidth;
      const height = video.videoHeight;
      const aspectRatio = width / height;

      // 9:16 = 0.5625，允許一些誤差
      if (aspectRatio > 0.7) {
        reject({ 
          code: 'WRONG_ASPECT', 
          message: '請上傳直式影片（9:16 比例）' 
        });
        return;
      }

      resolve({
        duration: Math.round(duration),
        width,
        height,
        aspectRatio,
        size: file.size,
        format: file.type,
      });
    };

    video.onerror = () => {
      reject({ code: 'LOAD_ERROR', message: '無法讀取影片，請確認檔案是否損壞' });
    };

    video.src = URL.createObjectURL(file);
  });
}

export default officialTasks;

