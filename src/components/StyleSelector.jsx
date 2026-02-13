import React from 'react';
import { moodCategories, voiceCategories, filterSongs } from '../data/songs';
import { CyberWindow, CyberButton } from './Win95Window';

export function StyleSelector({
  selectedMood,
  selectedVoice,
  onMoodChange,
  onVoiceChange,
  onConfirm,
  onCancel,
}) {
  // 計算可用歌曲數量
  const availableSongs = filterSongs(selectedMood, selectedVoice);
  const songCount = availableSongs.length;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <CyberWindow title="篩選條件設定" onClose={onCancel} className="border-neon-blue">
        <div className="space-y-6">
          {/* 曲風選擇 */}
          <div>
            <h3 className="text-neon-blue text-xs font-mono mb-3 flex items-center gap-2 tracking-widest">
              <span>::</span> 曲風分析 / MOOD
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(moodCategories).map(([key, { label, icon, color }]) => (
                <button
                  key={key}
                  onClick={() => onMoodChange(selectedMood === key ? null : key)}
                  className={`
                      relative p-2 rounded-none border transition-all duration-200 group
                      ${selectedMood === key
                      ? 'border-neon-blue bg-neon-blue/20 text-neon-blue shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                      : 'border-metal-silver/30 bg-black text-metal-silver hover:border-neon-blue/50 hover:text-white'
                    }
                    `}
                >
                  <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{icon}</div>
                  <div className="text-[10px] font-mono font-bold uppercase">
                    {label}
                  </div>
                  {selectedMood === key && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-neon-blue animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 聲線選擇 */}
          <div>
            <h3 className="text-neon-blue text-xs font-mono mb-3 flex items-center gap-2 tracking-widest">
              <span>::</span> 聲線分析 / VOCAL
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(voiceCategories).map(([key, { label, icon, color }]) => (
                <button
                  key={key}
                  onClick={() => onVoiceChange(selectedVoice === key ? null : key)}
                  className={`
                      relative p-2 rounded-none border transition-all duration-200 group
                      ${selectedVoice === key
                      ? 'border-neon-blue bg-neon-blue/20 text-neon-blue shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                      : 'border-metal-silver/30 bg-black text-metal-silver hover:border-neon-blue/50 hover:text-white'
                    }
                    `}
                >
                  <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{icon}</div>
                  <div className="text-[10px] font-mono font-bold uppercase">
                    {label}
                  </div>
                  {selectedVoice === key && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-neon-blue animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 可用歌曲數量 */}
          <div className={`text-center p-3 border ${songCount > 0 ? 'border-neon-green/30 bg-neon-green/5' : 'border-red-500/30 bg-red-900/10'}`}>
            <div className="text-metal-silver text-[10px] font-mono mb-1">符合項目 / MATCHING</div>
            <div className={`text-2xl font-bold font-mono ${songCount > 0 ? 'text-neon-green' : 'text-red-500'}`}>
              {songCount}
            </div>
          </div>

          {/* 按鈕 */}
          <div className="flex gap-4 pt-2">
            <CyberButton
              onClick={() => {
                onMoodChange(null);
                onVoiceChange(null);
              }}
              className="flex-1 text-xs"
              variant="default"
              disabled={false}
            >
              重置
            </CyberButton>
            <CyberButton
              onClick={onConfirm}
              disabled={songCount === 0}
              className="flex-1 text-xs"
              variant="neon" // Use neon variant for proceed
            >
              啟動抽選程序
            </CyberButton>
          </div>
        </div>
      </CyberWindow>
    </div>
  );
}

export default StyleSelector;
