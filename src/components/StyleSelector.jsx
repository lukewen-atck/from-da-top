import React from 'react';
import { moodCategories, voiceCategories, filterSongs } from '../data/songs';

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-sm">
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 to-cyber-green/30 blur-3xl rounded-full" />
        
        {/* 主卡片 */}
        <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-xl border-2 border-neon-purple/50 shadow-2xl overflow-hidden">
          {/* Windows 95 風格標題列 */}
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🎵</span>
              <span className="text-white font-bold text-sm">選擇你的風格</span>
            </div>
            {onCancel && (
              <button 
                onClick={onCancel}
                className="text-white hover:bg-red-500 px-2 rounded text-sm"
              >
                ✕
              </button>
            )}
          </div>

          <div className="p-5 space-y-6">
            {/* 曲風選擇 */}
            <div>
              <h3 className="text-metal-silver text-sm font-bold mb-3 flex items-center gap-2">
                <span>🎼</span> 曲風偏好
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(moodCategories).map(([key, { label, icon, color }]) => (
                  <button
                    key={key}
                    onClick={() => onMoodChange(selectedMood === key ? null : key)}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-200
                      ${selectedMood === key 
                        ? `border-white bg-gradient-to-br ${color} shadow-lg scale-105` 
                        : 'border-metal-silver/30 bg-black/30 hover:border-metal-silver/60 hover:bg-black/50'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className={`text-xs font-bold ${selectedMood === key ? 'text-white' : 'text-metal-silver'}`}>
                      {label}
                    </div>
                    {selectedMood === key && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-green rounded-full flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 聲線選擇 */}
            <div>
              <h3 className="text-metal-silver text-sm font-bold mb-3 flex items-center gap-2">
                <span>🎤</span> 聲線偏好
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(voiceCategories).map(([key, { label, icon, color }]) => (
                  <button
                    key={key}
                    onClick={() => onVoiceChange(selectedVoice === key ? null : key)}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-200
                      ${selectedVoice === key 
                        ? `border-white bg-gradient-to-br ${color} shadow-lg scale-105` 
                        : 'border-metal-silver/30 bg-black/30 hover:border-metal-silver/60 hover:bg-black/50'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className={`text-xs font-bold ${selectedVoice === key ? 'text-white' : 'text-metal-silver'}`}>
                      {label}
                    </div>
                    {selectedVoice === key && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-green rounded-full flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 可用歌曲數量 */}
            <div className="text-center p-3 bg-black/30 rounded-lg border border-metal-silver/20">
              <div className="text-metal-silver text-xs mb-1">符合條件的歌曲</div>
              <div className={`text-2xl font-bold ${songCount > 0 ? 'text-cyber-green' : 'text-red-500'}`}>
                {songCount} 首
              </div>
              {songCount === 0 && (
                <div className="text-red-400 text-xs mt-1">
                  請調整篩選條件
                </div>
              )}
            </div>

            {/* 按鈕 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onMoodChange(null);
                  onVoiceChange(null);
                }}
                className="flex-1 py-3 bg-metal-silver/20 text-metal-silver rounded-lg border border-metal-silver/30 hover:bg-metal-silver/30 transition-colors text-sm font-bold"
              >
                清除篩選
              </button>
              <button
                onClick={onConfirm}
                disabled={songCount === 0}
                className={`
                  flex-1 py-3 rounded-lg font-bold text-sm transition-all
                  ${songCount > 0 
                    ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:shadow-lg hover:shadow-neon-purple/50' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                開始抽選！🎵
              </button>
            </div>

            {/* 提示 */}
            <p className="text-center text-metal-silver/50 text-xs">
              不選擇 = 隨機從全部歌曲中抽選
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StyleSelector;
