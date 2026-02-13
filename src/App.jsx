import React, { useState, useEffect, useCallback } from 'react';
import { songs, filterSongs, getSongStats, CURRENT_VERSION } from './data/songs';
import { useUserState } from './hooks/useUserState';
import { CDPlayer } from './components/CDPlayer';
import { ResultCard } from './components/ResultCard';
import { TaskModal } from './components/TaskModal';
import { StyleSelector } from './components/StyleSelector';
import { Win95Window, Win95Button, Win95ProgressBar } from './components/Win95Window';

function App() {
  // 使用者狀態管理
  const {
    uid,
    userData,
    isLoading,
    hasDrawn,
    canStartTask,
    hasActiveTask,
    canSecondDraw,
    isFullyLocked,
    saveDrawResult,
    assignTask,
    completeTask,
    useSecondDraw,
    getAssignedTask,
    resetUser,
  } = useUserState();

  // 本地狀態
  const [currentSong, setCurrentSong] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isNewResult, setIsNewResult] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // 風格篩選狀態
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSecondDrawFlow, setIsSecondDrawFlow] = useState(false);

  // 獲取歌曲統計
  const songStats = getSongStats();
  const authApiBase = import.meta.env.VITE_AUTH_API_BASE || '';

  // 開機動畫
  useEffect(() => {
    if (isBooting) {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsBooting(false), 300);
            return 100;
          }
          return prev + Math.random() * 20 + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isBooting]);

  // 載入已抽取的歌曲
  useEffect(() => {
    if (hasDrawn && userData?.drawnSongId) {
      const song = songs.find(s => s.id === userData.drawnSongId);
      if (song) {
        setCurrentSong(song);
        setShowResult(true);
        setIsNewResult(false);
      }
    }

    if (userData?.assignedTaskId) {
      setCurrentTask(getAssignedTask());
    }
  }, [hasDrawn, userData, getAssignedTask]);

  // 載入本機登入狀態
  useEffect(() => {
    const stored = localStorage.getItem('echo_auth');
    if (stored) {
      try {
        setAuthUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('echo_auth');
      }
    }
    setIsAuthReady(true);
  }, []);

  // 開始選擇風格（第一次抽取）
  const handleStartFirstDraw = () => {
    setIsSecondDrawFlow(false);
    setSelectedMood(null);
    setSelectedVoice(null);
    setShowStyleSelector(true);
  };

  // 開始選擇風格（第二次抽取）
  const handleStartSecondDraw = () => {
    setIsSecondDrawFlow(true);
    setSelectedMood(null);
    setSelectedVoice(null);
    setShowStyleSelector(true);
  };

  // 確認風格並開始抽取
  const handleConfirmStyleAndDraw = () => {
    setShowStyleSelector(false);
    drawSong();
  };

  // 隨機抽取歌曲
  const drawSong = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    setIsNewResult(true);

    const availableSongs = filterSongs(selectedMood, selectedVoice);

    if (availableSongs.length === 0) {
      console.error('沒有符合條件的歌曲');
      setIsSpinning(false);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];

    setTimeout(() => {
      setCurrentSong(selectedSong);
      setIsSpinning(false);

      if (!hasDrawn) {
        saveDrawResult(selectedSong.id);
      } else if (canSecondDraw) {
        useSecondDraw(selectedSong.id);
      }

      setTimeout(() => {
        setShowResult(true);
      }, 300);
    }, 3000);
  }, [isSpinning, hasDrawn, canSecondDraw, saveDrawResult, useSecondDraw, selectedMood, selectedVoice]);

  // 開始任務（指派任務）
  const handleStartTaskFlow = () => {
    const task = assignTask();
    if (task) {
      setCurrentTask(task);
      setShowTaskModal(true);
    }
  };

  // 繼續已指派的任務
  const handleContinueTask = () => {
    if (currentTask) {
      setShowTaskModal(true);
    }
  };

  // 任務完成
  const handleTaskComplete = (videoInfo) => {
    completeTask(videoInfo);
  };

  // 關閉任務彈窗
  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
  };

  // 開機畫面
  if (isBooting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="scanlines" />
        <div className="text-center mb-6">
          {/* 主標題 */}
          <h1 className="text-3xl md:text-4xl font-bold text-cyber-green neon-text-green font-y2k tracking-widest mb-2">
            FROM DA ECHO
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-neon-purple neon-text font-y2k tracking-wider">
            CHALLENGE
          </h2>

          {/* 副標題 */}
          <div className="text-metal-silver font-y2k text-sm mt-3 tracking-wide">
            金曲翻唱挑戰系統
          </div>

          {/* 版本號 */}
          <div className="text-metal-silver/50 font-mono text-xs mt-1">
            v2.0.1.5
          </div>
        </div>

        <div className="w-full max-w-xs">
          <Win95ProgressBar progress={Math.min(bootProgress, 100)} />
          <div className="text-cyber-green font-mono text-xs mt-2 text-center">
            {bootProgress < 40 && '載入系統...'}
            {bootProgress >= 40 && bootProgress < 80 && `載入歌曲 (${songStats.total}首)...`}
            {bootProgress >= 80 && '準備就緒！'}
          </div>
        </div>

        <div className="mt-6 text-metal-silver/40 text-xs font-mono">
          © 2026 T@P GAMIFICATION // ARTICHOKE ARK
        </div>
      </div>
    );
  }

  // 載入中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-neon-purple font-pixel animate-pulse">
          載入中...
        </div>
      </div>
    );
  }

  // 計算狀態顯示
  const getStatusInfo = () => {
    if (!hasDrawn) {
      return { text: '初次抽歌', color: 'text-cyber-green' };
    }
    if (isFullyLocked) {
      return { text: '已完成', color: 'text-metal-silver' };
    }
    if (canSecondDraw) {
      return { text: '第二次機會已解鎖', color: 'text-neon-pink' };
    }
    if (hasActiveTask) {
      return { text: '任務進行中', color: 'text-yellow-400' };
    }
    if (userData?.taskCompleted) {
      return { text: '任務已完成', color: 'text-cyber-green' };
    }
    return { text: '可解鎖再抽機會', color: 'text-neon-purple' };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] relative overflow-hidden">
      {/* 掃描線效果 */}
      <div className="scanlines" />

      {/* 背景網格 */}
      <div className="absolute inset-0 retro-grid opacity-20" />

      {/* 背景光暈 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-neon-purple/15 rounded-full blur-3xl" />

      {/* 主內容 */}
      <div className="relative z-10 min-h-screen flex flex-col p-3">
        {/* 頂部標題 - 緊湊版 */}
        <header className="text-center py-3">
          <h1 className="text-xl md:text-2xl font-bold text-cyber-green neon-text-green font-y2k tracking-wider">
            FROM DA ECHO <span className="text-neon-purple">CHALLENGE</span>
          </h1>
          <p className="text-metal-silver/70 text-xs mt-1 font-y2k">
            {songStats.total}首經典 • 2000-2010
          </p>
          {uid && (
            <div className="mt-1 flex justify-center items-center gap-2">
              <span className="text-xs text-neon-purple/50 font-mono">
                {uid.substring(0, 8)}...
              </span>
              <span className={`text-xs font-bold ${statusInfo.color}`}>
                • {statusInfo.text}
              </span>
            </div>
          )}
        </header>

        {/* 主要區域 - 緊湊版 */}
        <main className="flex-1 flex flex-col items-center justify-start gap-4 pb-16">
          {/* CD 播放器 - 只在非結果狀態顯示 */}
          {(!showResult || isSpinning) && (
            <CDPlayer
              isSpinning={isSpinning}
              currentSong={currentSong}
              onAnimationEnd={() => { }}
            />
          )}

          {/* 結果卡片 */}
          {showResult && currentSong && !isSpinning && (
            <div className="w-full max-w-sm animate-float">
              <ResultCard
                song={currentSong}
                isNew={isNewResult}
              />
            </div>
          )}

          {/* 操作按鈕區 - 緊湊版 */}
          <div className="w-full max-w-xs space-y-2">
            {/* 首次抽取按鈕 */}
            {!hasDrawn && !isSpinning && (
              <Win95Button
                onClick={handleStartFirstDraw}
                variant="primary"
                className="w-full py-3 text-lg"
              >
                🎵 開始抽選！
              </Win95Button>
            )}

            {/* 已完成首次抽取，可開始任務 */}
            {canStartTask && !isSpinning && (
              <div className="space-y-2">
                <div className="text-center p-2 bg-black/30 rounded-lg border border-neon-purple/30">
                  <p className="text-metal-silver text-xs">
                    🎯 完成任務解鎖第二次機會
                  </p>
                </div>

                <Win95Button
                  onClick={handleStartTaskFlow}
                  variant="neon"
                  className="w-full py-2.5"
                >
                  ⚡ 接受任務
                </Win95Button>
              </div>
            )}

            {/* 任務進行中 */}
            {hasActiveTask && !isSpinning && (
              <div className="space-y-2">
                <div className="text-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-400 text-xs font-bold">
                    📋 {currentTask?.name}
                  </p>
                </div>

                <Win95Button
                  onClick={handleContinueTask}
                  variant="primary"
                  className="w-full py-2.5"
                >
                  繼續任務 🎬
                </Win95Button>
              </div>
            )}

            {/* 已解鎖第二次抽取 */}
            {canSecondDraw && !isSpinning && (
              <div className="space-y-2">
                <div className="text-center p-2 bg-cyber-green/10 rounded-lg border border-cyber-green/30">
                  <p className="text-cyber-green text-xs font-bold">
                    🎉 第二次機會已解鎖！
                  </p>
                </div>
                <Win95Button
                  onClick={handleStartSecondDraw}
                  variant="primary"
                  className="w-full py-3 text-lg animate-pulse"
                >
                  🎵 再抽一次！
                </Win95Button>
              </div>
            )}

            {/* 已完全鎖定 */}
            {isFullyLocked && !isSpinning && (
              <div className="text-center p-3 bg-black/30 rounded-lg border border-metal-silver/30">
                <p className="text-metal-silver text-xs">
                  ✅ 抽選完成
                </p>
                {userData?.drawCount === 2 && (
                  <p className="text-xs text-cyber-green mt-1">
                    🏆 任務達人
                  </p>
                )}
              </div>
            )}

            {/* 抽選中狀態 */}
            {isSpinning && (
              <div className="text-center p-3 bg-black/30 rounded-lg border border-neon-purple/30">
                <div className="text-neon-purple font-pixel animate-pulse">
                  🎰 抽選中...
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 底部資訊 */}
        <footer className="text-center py-2">
          <div className="text-metal-silver/30 text-xs font-mono">
            © 2026 T@P GAMIFICATION // ARTICHOKE ARK
          </div>

          {import.meta.env.DEV && (
            <button
              onClick={resetUser}
              className="mt-1 text-xs text-red-500/50 hover:text-red-500"
            >
              [DEV] 重置
            </button>
          )}
        </footer>
      </div>

      {/* 風格選擇彈窗 */}
      {showStyleSelector && (
        <StyleSelector
          selectedMood={selectedMood}
          selectedVoice={selectedVoice}
          onMoodChange={setSelectedMood}
          onVoiceChange={setSelectedVoice}
          onConfirm={handleConfirmStyleAndDraw}
          onCancel={() => setShowStyleSelector(false)}
        />
      )}

      {/* 任務彈窗 */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={handleCloseTaskModal}
        task={currentTask}
        song={currentSong}
        onTaskComplete={handleTaskComplete}
        onStartTask={() => { }}
      />

      {/* OTP 登入 */}
    </div>
  );
}

export default App;
