import React, { useState, useEffect } from 'react';
import { genreComments, moodCategories, voiceCategories, getAlbumArt } from '../data/songs';
import { CyberWindow } from './Win95Window';

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
        emoji: ['✨', '⚡', '🟢', '🟣'][Math.floor(Math.random() * 4)],
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
      'from-neon-purple to-neon-pink',
      'from-neon-blue to-neon-green',
      'from-cyber-black to-metal-silver',
    ];
    const index = song.artist.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  // 初始化音訊
  useEffect(() => {
    const url = song.preview_url || song.previewUrl;
    if (url) {
      const newAudio = new Audio(url);
      newAudio.volume = 0.5;
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [song]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative group">
      {/* 粒子效果 */}
      {isNew && particles.map(p => (
        <div
          key={p.id}
          className="absolute pointer-events-none animate-float z-50 text-neon-green"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            opacity: 0.8,
            textShadow: '0 0 5px #00ff41',
          }}
        >
          {p.emoji}
        </div>
      ))}

      <div className={`transform transition-all duration-500 ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="relative bg-black border-2 border-neon-purple p-1">
          {/* Cyber Header */}
          <div className="bg-neon-purple text-black font-bold font-mono px-2 py-1 flex justify-between items-center text-xs mb-1">
            <span>&gt;&gt; 搜尋結果確認</span>
            <span className="animate-pulse">■</span>
          </div>

          <div className="border border-neon-purple/30 p-2 relative overflow-hidden">
            {/* 專輯封面區域 */}
            <div className="relative aspect-square w-full mb-3 group-hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute inset-0 border border-neon-green/50 z-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green z-20" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green z-20" />

              {/* Image */}
              {!imageError ? (
                <img
                  src={albumArtUrl}
                  alt={`${song.title} - ${song.artist}`}
                  className={`w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              ) : null}

              {/* Fallback */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient()} flex items-center justify-center transition-opacity duration-300 ${imageLoaded && !imageError ? 'opacity-0' : 'opacity-100'}`}
              >
                <div className="text-center text-white">
                  <div className="text-4xl mb-2 animate-spin-slow">💿</div>
                  <div className="text-xs font-mono truncate px-2 text-white bg-black/50">{song.artist}</div>
                </div>
              </div>

              {/* Play Button Overlay */}
              {(song.preview_url || song.previewUrl) && (
                <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-black/80 border-2 border-neon-green text-neon-green flex items-center justify-center hover:bg-neon-green hover:text-black transition-all cursor-pointer pointer-events-auto transform hover:scale-110 shadow-[0_0_15px_rgba(0,255,65,0.5)]"
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

              {/* Meta Tags Overlay */}
              <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1 z-30 pointer-events-none">
                <span className="bg-black/80 text-neon-green border border-neon-green/50 px-1 text-[10px] font-mono">
                  {song.year}
                </span>
                <span className="bg-black/80 text-neon-purple border border-neon-purple/50 px-1 text-[10px] font-mono">
                  {songVocal}
                </span>
              </div>
            </div>

            {/* Song Info */}
            <div className="text-center space-y-1 mb-3 relative z-50">
              {/* Audio Visualizer (Fake) if playing */}
              {isPlaying && (
                <div className="absolute -top-6 left-0 right-0 h-4 flex items-end justify-center gap-1 opacity-70">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-neon-green animate-music-bar"
                      style={{ animationDelay: `${i * 0.1}s`, height: '100%' }}
                    />
                  ))}
                </div>
              )}
              <h2 className="text-2xl font-bold text-white font-sans tracking-tight leading-none neon-text">
                {song.title}
              </h2>
              <div className="h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-metal-silver/50 to-transparent" />
              <p className="text-metal-silver text-sm font-mono tracking-widest uppercase">
                {song.artist}
              </p>
            </div>

            {/* Comment Box */}
            <div className="bg-neon-purple/10 border border-neon-purple/30 p-2 text-center relative hover:bg-neon-purple/20 transition-colors">
              <p className="text-neon-purple text-xs font-mono leading-relaxed">
                &quot;{comment}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
