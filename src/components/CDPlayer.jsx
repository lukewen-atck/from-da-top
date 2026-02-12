import React, { useState, useEffect } from 'react';
import { songs } from '../data/songs';

export function CDPlayer({ isSpinning, currentSong, onAnimationEnd }) {
  const [displaySong, setDisplaySong] = useState(null);
  const [flashIndex, setFlashIndex] = useState(0);

  // 快速閃動歌曲動畫
  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * songs.length);
        setDisplaySong(songs[randomIndex]);
        setFlashIndex(prev => prev + 1);
      }, 80);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        setDisplaySong(currentSong);
        if (onAnimationEnd) onAnimationEnd();
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isSpinning, currentSong, onAnimationEnd]);

  // 顯示的歌曲
  const showSong = isSpinning ? displaySong : currentSong;

  return (
    <div className="relative flex flex-col items-center">
      {/* 歌曲顯示區域 - 簡化版 iPod 風格 */}
      <div className="w-full max-w-xs">
        <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-xl p-3 border border-[#444] shadow-xl">
          {/* 螢幕區域 */}
          <div className={`bg-gradient-to-b from-[#8ec2f7] to-[#5fa8e8] rounded-lg p-3 min-h-[80px] relative overflow-hidden ${isSpinning ? 'animate-pulse' : ''}`}>
            {/* CD 動畫在轉盤模式 */}
            {isSpinning && (
              <div className="absolute top-2 right-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-metal-silver to-gray-400 animate-[cd-spin_0.3s_linear_infinite] border-2 border-gray-500">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/30 to-cyan-500/30" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#333] rounded-full" />
                </div>
              </div>
            )}
            
            {showSong ? (
              <div className={`text-black ${isSpinning ? 'song-flashing' : ''}`}>
                <div className="text-xs text-[#333] mb-1 font-bold">
                  {isSpinning ? '🎰 SHUFFLE...' : '🎵 NOW PLAYING'}
                </div>
                <div className="font-bold text-lg truncate pr-10">{showSong.title}</div>
                <div className="text-sm text-[#444] truncate">{showSong.artist}</div>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#555]">
                  <span className="bg-black/10 px-2 py-0.5 rounded">{showSong.year}</span>
                  <span className="bg-black/10 px-2 py-0.5 rounded">{showSong.tempo || showSong.mood}</span>
                </div>
              </div>
            ) : (
              <div className="text-black/50 text-center py-2">
                <div className="text-xl mb-1">🎵</div>
                <div className="text-xs">等待抽選...</div>
              </div>
            )}
          </div>

          {/* 簡化控制區 */}
          <div className="flex justify-center items-center gap-4 mt-3 text-[#666]">
            <span className="text-sm">◀◀</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#555] to-[#333] flex items-center justify-center border border-[#666]">
              <span className="text-xs">▶</span>
            </div>
            <span className="text-sm">▶▶</span>
          </div>
        </div>
      </div>

      {/* 閃動計數器 */}
      {isSpinning && (
        <div className="mt-3 text-neon-purple font-pixel text-xs animate-pulse">
          🎰 抽選中... #{flashIndex}
        </div>
      )}
    </div>
  );
}

export default CDPlayer;
