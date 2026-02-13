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
      {/* 歌曲顯示區域 - Cyber Industrial Style */}
      <div className="w-full max-w-xs z-10 relative">
        {/* Exterior Frame */}
        <div className="bg-black border border-metal-silver/50 p-2 relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-metal-silver" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-metal-silver" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-metal-silver" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-metal-silver" />

          <div className="bg-[#050505] border border-neon-green/30 p-4 relative overflow-hidden h-[180px]">
            {/* Scanning Line Animation */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/10 to-transparent h-[20%] w-full animate-[scan_2s_linear_infinite] pointer-events-none" />

            {/* CD Disc - Animated only when spinning */}
            {isSpinning && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                <div className="w-[140px] h-[140px] rounded-full border-2 border-neon-green/30 animate-[spin_1s_linear_infinite]" />
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-2">
              {showSong ? (
                <div className={`text-white transition-opacity duration-100 ${isSpinning ? 'opacity-80' : 'opacity-100'}`}>
                  <div className="text-[10px] text-neon-green font-mono mb-2 tracking-widest border-b border-neon-green/30 pb-1 w-full">
                    {isSpinning ? '>> 資料庫搜尋中...' : '>> 目標已鎖定'}
                  </div>
                  <div className="font-bold text-2xl truncate text-white uppercase tracking-wider">{showSong.title}</div>
                  <div className="text-sm text-metal-silver font-mono">{showSong.artist}</div>
                  <div className="flex justify-center items-center gap-2 mt-3">
                    <span className="text-[10px] bg-neon-purple/20 text-neon-purple px-1 border border-neon-purple/30">{showSong.year}</span>
                    <span className="text-[10px] bg-neon-green/20 text-neon-green px-1 border border-neon-green/30">{showSong.tempo || showSong.mood}</span>
                  </div>
                </div>
              ) : (
                <div className="text-metal-silver/30 font-mono text-xs">
                  <div>[ 等待指令 ]</div>
                  <div className="mt-2 text-[40px] opacity-20">💿</div>
                </div>
              )}
            </div>
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
