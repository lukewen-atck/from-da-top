import React, { useState, useEffect } from 'react';
import { genreComments, moodCategories, voiceCategories, getAlbumArt } from '../data/songs';
import { Win95Window } from './Win95Window';

export function ResultCard({ song, isNew = false, onClose }) {
  const [showContent, setShowContent] = useState(false);
  const [particles, setParticles] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 進場動畫
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setShowContent(true), 300);
      
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 3,
        delay: Math.random() * 0.5,
        emoji: ['✨', '🎵', '🎶', '⭐'][Math.floor(Math.random() * 4)],
      }));
      setParticles(newParticles);
    } else {
      setShowContent(true);
    }
    
    // 重置圖片狀態
    setImageLoaded(false);
    setImageError(false);
  }, [isNew, song]);

  // 取得曲風（相容新舊版本）
  const songTempo = song.tempo || song.mood || '抒情';
  const songVocal = song.vocal || song.voice || '男生';

  // 獲取評語
  const getComment = () => {
    if (song.genre && genreComments[song.genre]) {
      return genreComments[song.genre];
    }
    if (genreComments[songTempo]) {
      return genreComments[songTempo];
    }
    return '經典金曲，必須收藏！🎧';
  };

  const comment = getComment();
  const tempoInfo = moodCategories[songTempo];
  const vocalInfo = voiceCategories[songVocal];
  
  // 獲取專輯封面
  const albumArtUrl = getAlbumArt(song);
  
  // 生成備用漸層色（基於歌手名）
  const getFallbackGradient = () => {
    const colors = [
      'from-purple-600 to-pink-500',
      'from-blue-600 to-cyan-500',
      'from-green-600 to-teal-500',
      'from-orange-600 to-red-500',
      'from-indigo-600 to-purple-500',
      'from-pink-600 to-rose-500',
    ];
    const index = song.artist.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative">
      {/* 粒子效果 */}
      {isNew && particles.map(p => (
        <div
          key={p.id}
          className="absolute pointer-events-none animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            opacity: 0.8,
          }}
        >
          {p.emoji}
        </div>
      ))}

      <Win95Window 
        title="🎵 抽選結果" 
        onClose={onClose}
        className={`transform transition-all duration-500 ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* 結果卡片內容 - 緊湊版 */}
        <div className="bg-gradient-to-br from-[#1a0a2e] to-[#0f0f1a] rounded-lg p-3 pixel-border">
          {/* 專輯封面區域 */}
          <div className="relative mb-3">
            <div className="w-full aspect-square rounded-lg overflow-hidden shadow-xl">
              {/* 專輯封面圖片 */}
              {!imageError ? (
                <img
                  src={albumArtUrl}
                  alt={`${song.title} - ${song.artist}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              ) : null}
              
              {/* 備用漸層背景（圖片載入中或失敗時顯示） */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient()} flex items-center justify-center transition-opacity duration-300 ${imageLoaded && !imageError ? 'opacity-0' : 'opacity-100'}`}
              >
                <div className="text-center text-white">
                  <div className="text-5xl mb-2">💿</div>
                  <div className="text-lg font-bold truncate px-4">{song.artist}</div>
                </div>
              </div>
              
              {/* 光暈效果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            {/* 年份標籤 */}
            <div className="absolute top-2 right-2 bg-neon-purple/90 px-2 py-0.5 rounded font-pixel text-xs text-white shadow-lg">
              {song.year}
            </div>

            {/* 聲線標籤 */}
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white">
              {vocalInfo?.icon || '🎤'} {songVocal}
            </div>
            
            {/* 歌曲標題（疊加在封面底部） */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
              <h2 className="text-xl font-bold text-white neon-text truncate">
                {song.title}
              </h2>
              <p className="text-sm text-metal-silver truncate">
                {song.artist}
              </p>
            </div>
          </div>

          {/* 標籤列 */}
          <div className="flex justify-center gap-2 flex-wrap mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-y2k bg-gradient-to-r ${tempoInfo?.color || 'from-gray-500 to-gray-600'} text-white`}>
              {tempoInfo?.icon || '🎵'} {songTempo}
            </span>
            
            {song.genre && song.genre !== songTempo && (
              <span className="px-3 py-1 bg-metal-silver/20 text-metal-silver rounded-full text-xs font-y2k">
                {song.genre}
              </span>
            )}
          </div>

          {/* 曲風短評 */}
          <div className="p-2 bg-black/30 rounded-lg border border-neon-purple/30">
            <p className="text-center text-xs text-gray-300 font-y2k leading-relaxed">
              「{comment}」
            </p>
          </div>

          {/* Footer */}
          <div className="mt-2 text-center">
            <span className="text-xs text-metal-silver/40 font-pixel">
              FROM DA ECHO CHALLENGE
            </span>
          </div>
        </div>
      </Win95Window>
    </div>
  );
}

export default ResultCard;
