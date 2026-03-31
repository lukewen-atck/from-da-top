'use client';

import React, { useState, useEffect } from 'react';
import { CDPlayer } from './CDPlayer';
import { ResultCard } from './ResultCard';
import { CyberButton, CyberWindow, CyberProgressBar } from './Win95Window';
import { StyleSelector } from './StyleSelector';
import { getSongStats } from '../data/songs';
import { drawSong, confirmSong, executeReroll, updateInstagram } from '../app/actions';
import { CyberToast } from './CyberToast';

// Tasks for reroll (Interview Style)
const REROLL_TASKS = [
    { id: 'q1', name: '題目 A', description: '請錄一段影片，說說你對剛剛那首『原本的歌』的第一印象是什麼？為什麼想換掉它？' },
    { id: 'q2', name: '題目 B', description: '請錄一段影片，用一句話形容你現在緊張（或是期待）的心情。' },
    { id: 'q3', name: '題目 C', description: '請對著鏡頭說出你對這次『FROM DA ECHO』挑戰的一個期許或狠話。' },
];

export default function HomeClient({ initialUser, initialSong, uid }: { initialUser: any, initialSong: any, uid: string }) {
    // State from Server
    const [user, setUser] = useState(initialUser);
    const [lockedSong, setLockedSong] = useState(initialSong);

    // Local UI State
    const [currentSong, setCurrentSong] = useState<any>(
        (!!initialUser.selected_song_id && initialUser.note?.includes('[FAKE_DRAW]')) ? null : initialSong
    );
    const [isSpinning, setIsSpinning] = useState(false);
    const [showResult, setShowResult] = useState(
        !!initialSong && !(!!initialUser.selected_song_id && initialUser.note?.includes('[FAKE_DRAW]'))
    );
    const [isNewResult, setIsNewResult] = useState(false);
    const [showStyleSelector, setShowStyleSelector] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [currentTask, setCurrentTask] = useState<any>(null);

    // New: Recording Check Modal State
    const [showRecordingCheck, setShowRecordingCheck] = useState(false);

    // New: Instagram Input State
    const [showInstagramInput, setShowInstagramInput] = useState(false);
    const [instagramHandle, setInstagramHandle] = useState('');

    // Filter State
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

    // Boot Animation
    const [isBooting, setIsBooting] = useState(true);
    const [bootProgress, setBootProgress] = useState(0);

    // Loading & Toast State
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const songStats = getSongStats();

    // Boot Effect
    useEffect(() => {
        if (isBooting) {
            const interval = setInterval(() => {
                setBootProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setIsBooting(false), 100); // Faster boot for cyber feel
                        return 100;
                    }
                    return prev + Math.random() * 20 + 10;
                });
            }, 150);
            return () => clearInterval(interval);
        }
    }, [isBooting]);

    // Derived State
    const isLocked = !!user.selected_song_id;
    const isFakeDrawPending = isLocked && user.note?.includes('[FAKE_DRAW]');
    const effectiveIsLocked = isLocked && !isFakeDrawPending;
    const canReroll = !user.has_rerolled && !effectiveIsLocked;

    // Handlers
    const handleStartDraw = () => {
        // Step 0: Check Instagram first
        if (!user.instagram) {
            setShowInstagramInput(true);
            return;
        }

        // Step 1: Open Recording Check first
        setShowRecordingCheck(true);
    };

    const handleSaveInstagram = async () => {
        if (!instagramHandle.trim() || isProcessing) return;
        setIsProcessing(true);
        try {
            const res = await updateInstagram(uid, instagramHandle);
            if (res.success) {
                // Update local user state with new instagram
                setUser({ ...user, instagram: instagramHandle });
                setShowInstagramInput(false);
                showToast('IG 帳號已儲存', 'success');

                // Proceed to next step automatically
                setTimeout(() => setShowRecordingCheck(true), 500);
            } else {
                showToast('儲存失敗: ' + res.message, 'error');
            }
        } catch (e) {
            showToast('連線錯誤', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmRecording = () => {
        // Step 2: Close Recording Check, Open Style Selector
        setShowRecordingCheck(false);
        setShowStyleSelector(true);
    };

    const handleConfirmStyleAndDraw = async () => {
        setShowStyleSelector(false);
        setIsSpinning(true);
        setShowResult(false);
        setIsNewResult(true);

        // 如果是假抽獎，不呼叫 API，直接等 3 秒然後顯示被分配的歌曲
        if (isFakeDrawPending) {
            setTimeout(() => {
                setCurrentSong(lockedSong);
                setIsSpinning(false);
                setTimeout(() => setShowResult(true), 300);
            }, 3000);
            return;
        }

        try {
            // Call Server Action with filters
            const result = await drawSong(uid, selectedMood, selectedVoice);

            if (result.error || !result.song) {
                showToast('抽選失敗: ' + (result.error || 'Unknown error'), 'error');
                setIsSpinning(false);
                return;
            }

            // Simulate delay for animation
            setTimeout(() => {
                setCurrentSong(result.song);
                setIsSpinning(false);
                setTimeout(() => setShowResult(true), 300);
            }, 3000);

        } catch (e) {
            console.error(e);
            setIsSpinning(false);
            showToast('系統錯誤，請重試', 'error');
        }
    };

    const handleConfirmSong = async () => {
        if (!currentSong || isProcessing) return;
        setIsProcessing(true);
        try {
            const res = await confirmSong(currentSong.id, uid);
            if (res.success) {
                showToast('歌曲確認成功！', 'success');
                // Update local state to locked
                setUser({ ...user, selected_song_id: currentSong.id });
                setLockedSong(currentSong);
            } else {
                showToast('確認失敗: ' + res.message, 'error');
            }
        } catch (e) {
            showToast('連線錯誤，請重試', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRequestReroll = () => {
        if (user.has_rerolled) {
            showToast('你已經使用過換歌機會囉！', 'info');
            return;
        }
        // Pick random task
        const task = REROLL_TASKS[Math.floor(Math.random() * REROLL_TASKS.length)];
        setCurrentTask(task);
        setShowTaskModal(true);
    };

    const handleTaskComplete = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            // Call server action to mark reroll used
            const res = await executeReroll(uid);
            if (res.success) {
                setUser({ ...user, has_rerolled: true });
                setShowTaskModal(false);
                setShowResult(false);
                setCurrentSong(null);

                showToast('任務完成！你可以重新抽選一次。', 'success');
            } else {
                showToast('換歌失敗: ' + res.message, 'error');
            }
        } catch (e) {
            showToast('連線錯誤', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isBooting) {
        return (
            <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-center p-4">
                <div className="scanlines" />
                <div className="text-center mb-8 relative">
                    <div className="absolute -inset-4 border border-neon-green/20 animate-pulse pointer-events-none" />
                    <h1 className="text-4xl md:text-5xl font-bold text-neon-green font-mono tracking-widest mb-2 glitch-effect" data-text="FROM DA ECHO">
                        FROM DA ECHO
                    </h1>
                    <h2 className="text-xl md:text-2xl font-bold text-neon-purple font-mono tracking-wider">
                        CHALLENGE SYSTEM
                    </h2>
                    <div className="text-metal-silver font-sans text-sm mt-4 tracking-wide">
                        金曲翻唱挑戰系統 // 初始化中...
                    </div>
                    <div className="text-neon-green/50 font-mono text-xs mt-1">
                        v3.0.0.NEON_DB
                    </div>
                </div>
                <div className="w-full max-w-xs space-y-2">
                    <CyberProgressBar progress={Math.min(bootProgress, 100)} />
                    <div className="flex justify-between text-neon-green font-mono text-xs">
                        <span>系統載入中...</span>
                        <span>{Math.floor(bootProgress)}%</span>
                    </div>
                </div>
            </div>
        );
    }

    // State A: Locked
    if (effectiveIsLocked && lockedSong) {
        return (
            <MainLayout uid={uid} songStats={songStats} status="已鎖定 / 待確認">
                <div className="w-full max-w-sm animate-float">
                    <ResultCard song={lockedSong} isNew={false} onClose={() => { }} />
                    <div className="text-center mt-6 p-4 bg-black/50 border border-neon-green/50 backdrop-blur-sm">
                        <p className="text-neon-green font-mono text-xs mb-1">&gt;&gt;&gt; 狀態：已鎖定</p>
                        <p className="text-white font-bold text-xl">{lockedSong.title}</p>
                        <p className="text-metal-silver text-sm">{lockedSong.artist}</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // State B: Unlocked / Drawing
    return (
        <MainLayout uid={uid} songStats={songStats} status={user.has_rerolled ? '換歌次數耗盡' : '系統就緒'}>

            {/* Toast Container */}
            {toast && (
                <CyberToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {(!showResult || isSpinning) && (
                <CDPlayer isSpinning={isSpinning} currentSong={currentSong || undefined} onAnimationEnd={() => { }} />
            )}

            {showResult && currentSong && !isSpinning && (
                <div className="w-full max-w-sm animate-float flex flex-col gap-6 pb-8">
                    <ResultCard song={currentSong} isNew={isNewResult} onClose={() => { }} />

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <CyberButton onClick={handleRequestReroll} disabled={user.has_rerolled || isProcessing} variant={user.has_rerolled ? 'default' : 'neon'}>
                            {user.has_rerolled ? '無法換歌' : '🔄 換歌任務'}
                        </CyberButton>
                        <CyberButton onClick={handleConfirmSong} variant="primary" disabled={isProcessing}>
                            {isProcessing ? '處理中...' : '✅ 確認歌曲'}
                        </CyberButton>
                    </div>
                </div>
            )}

            {(!showResult && !isSpinning) && (
                <div className="w-full max-w-xs mt-8 space-y-3 p-4">
                    <CyberButton onClick={handleStartDraw} variant="primary" className="w-full py-6 text-xl tracking-widest relative overflow-hidden group" disabled={isProcessing}>
                        <span className="relative z-10">[ 啟動抽選程序 ]</span>
                        <div className="absolute inset-0 bg-neon-green/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </CyberButton>

                    <div className="text-center animate-pulse">
                        <p className="text-yellow-400 font-bold text-xs bg-black/50 px-2 py-1 inline-block border border-yellow-400/50">
                            ⚠️ 警告：請務必錄下您的真實反應
                        </p>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showRecordingCheck && (
                <RecordingConfirmationModal
                    onConfirm={handleConfirmRecording}
                    onCancel={() => setShowRecordingCheck(false)}
                />
            )}

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

            {showTaskModal && currentTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
                    <CyberWindow title="訪談程序啟動" className="border-neon-purple w-full max-w-md my-auto" onClose={() => setShowTaskModal(false)}>
                        <div className="text-center space-y-6 py-2">
                            <div className="space-y-2">
                                <h3 className="text-neon-purple font-mono text-sm">&gt;&gt;&gt; 傳入提問</h3>
                                <div className="border border-neon-purple/30 p-4 bg-neon-purple/5">
                                    <h3 className="text-xl font-bold text-white mb-2">{currentTask.name}</h3>
                                    <p className="text-white/90 text-lg leading-relaxed">{currentTask.description}</p>
                                </div>
                            </div>

                            <div className="text-left text-sm text-metal-silver font-mono space-y-1 bg-black/50 p-3 border-l-2 border-metal-silver">
                                <p>&gt; 錄影模式：已啟用</p>
                                <p>&gt; 指令：請開啟錄影回答問題</p>
                                <p>&gt; 解鎖金鑰：回答完畢後點擊確認</p>
                            </div>

                            <div className="pt-4 flex justify-between gap-4">
                                <CyberButton onClick={() => setShowTaskModal(false)} variant="default" className="flex-1" disabled={isProcessing}>放棄</CyberButton>
                                <CyberButton onClick={handleTaskComplete} variant="primary" className="flex-1" disabled={isProcessing}>
                                    {isProcessing ? '驗證中...' : '確認錄製完成'}
                                </CyberButton>
                            </div>
                        </div>
                    </CyberWindow>
                </div>
            )}

            {/* Instagram Input Modal */}
            {showInstagramInput && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
                    <CyberWindow title="使用者身分驗證" className="border-neon-green w-full max-w-md shadow-[0_0_30px_rgba(0,255,65,0.2)]" onClose={() => setShowInstagramInput(false)}>
                        <div className="space-y-6 py-4 px-2">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-xl p-1 animate-pulse">
                                    <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📸</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white font-mono">輸入 Instagram 帳號</h3>
                                <p className="text-metal-silver text-sm">若中獎將透過 IG 聯繫您領獎</p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-neon-green font-mono">@</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={instagramHandle}
                                        onChange={(e) => setInstagramHandle(e.target.value)}
                                        className="w-full bg-black/50 border border-metal-silver text-white pl-8 pr-4 py-3 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green font-mono transition-all placeholder:text-gray-600"
                                        placeholder="your_instagram_id"
                                        autoFocus
                                    />
                                    <div className="absolute inset-0 border border-transparent group-hover:border-neon-green/30 pointer-events-none transition-colors" />
                                </div>

                                <div className="text-xs text-gray-500 text-center font-mono">
                                    * 請確認帳號正確，以免錯失獎項
                                </div>

                                <CyberButton
                                    onClick={handleSaveInstagram}
                                    variant="primary"
                                    className="w-full py-3 text-lg"
                                    disabled={!instagramHandle.trim() || isProcessing}
                                >
                                    {isProcessing ? '資料寫入中...' : '確認並繼續 >>'}
                                </CyberButton>
                            </div>
                        </div>
                    </CyberWindow>
                </div>
            )}

        </MainLayout>
    );
}

// Sub-component for Recording Check
function RecordingConfirmationModal({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
    const [checkedCamera, setCheckedCamera] = useState(false);
    const [checkedRec, setCheckedRec] = useState(false);

    const isReady = checkedCamera && checkedRec;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
            <CyberWindow title="錄影準備確認" className="border-red-500 w-full max-w-md shadow-[0_0_30px_rgba(255,0,0,0.3)]" onClose={onCancel}>
                <div className="space-y-6 py-4">
                    {/* Header */}
                    <div className="flex items-center justify-center gap-3 bg-red-500/10 p-3 border border-red-500/30 rounded">
                        <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#ff0000]" />
                        <span className="text-red-500 font-bold tracking-widest font-mono">等待錄影中...</span>
                    </div>

                    {/* Main Warning */}
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-white leading-tight">
                            機會只有 2 次！<br />
                            <span className="text-sm font-normal text-metal-silver">請確保相機已開始錄影。</span>
                        </h3>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-3 bg-black/50 p-4 border border-metal-silver/30">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${checkedCamera ? 'border-neon-green bg-neon-green/20' : 'border-metal-silver group-hover:border-white'}`}>
                                {checkedCamera && <span className="text-neon-green font-bold">✓</span>}
                            </div>
                            <input type="checkbox" className="hidden" checked={checkedCamera} onChange={(e) => setCheckedCamera(e.target.checked)} />
                            <span className={`text-lg transition-colors ${checkedCamera ? 'text-white' : 'text-metal-silver group-hover:text-white'}`}>鏡頭位置已架設</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${checkedRec ? 'border-neon-green bg-neon-green/20' : 'border-metal-silver group-hover:border-white'}`}>
                                {checkedRec && <span className="text-neon-green font-bold">✓</span>}
                            </div>
                            <input type="checkbox" className="hidden" checked={checkedRec} onChange={(e) => setCheckedRec(e.target.checked)} />
                            <span className={`text-lg transition-colors ${checkedRec ? 'text-white' : 'text-metal-silver group-hover:text-white'}`}>已按下錄影鍵 (REC)</span>
                        </label>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                        <CyberButton
                            onClick={onConfirm}
                            disabled={!isReady}
                            variant={isReady ? 'primary' : 'default'}
                            className={`w-full py-4 text-lg font-bold transition-all duration-300 ${isReady ? 'shadow-[0_0_20px_rgba(0,255,65,0.4)]' : 'opacity-50'}`}
                        >
                            {isReady ? '[ 確認無誤：開始抽選 ]' : '[ 等待確認... ]'}
                        </CyberButton>
                        <button onClick={onCancel} className="w-full mt-4 text-xs text-metal-silver hover:text-white underline decoration-dashed">
                            取消並返回
                        </button>
                    </div>
                </div>
            </CyberWindow>
        </div>
    );
}

// Sub-component for layout re-use
function MainLayout({ children, uid, songStats, status }: any) {
    return (
        <div className="min-h-screen bg-cyber-black flex flex-col font-sans overflow-x-hidden">
            <div className="scanlines fixed inset-0 pointer-events-none z-50" />

            {/* Background Grid - Fixed */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Header - Sticky */}
            <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-neon-green/20 w-full">
                <div className="max-w-md mx-auto p-4 pb-2">
                    <div className="flex justify-between items-center px-1 mb-1">
                        <span className="text-[10px] font-mono text-neon-green/50">系統連線...[線上]</span>
                        <span className="text-neon-purle font-mono text-[10px]">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white font-mono tracking-wider glitch-effect" data-text="FROM DA ECHO">
                            FROM DA ECHO
                        </h1>
                        <div className="mt-2 flex justify-center items-center gap-3 text-xs font-mono flex-wrap">
                            <span className="text-metal-silver whitespace-nowrap">歌曲總數: {songStats.total}</span>
                            <span className="text-metal-silver">|</span>
                            <span className="text-neon-purple whitespace-nowrap">UID: {uid.substring(0, 6)}</span>
                            <span className="text-metal-silver">|</span>
                            <span className="text-neon-green whitespace-nowrap">{status}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Scrollable Main Content */}
            <main className="flex-1 flex flex-col items-center justify-start p-4 pb-12 relative z-10 w-full max-w-md mx-auto">
                {children}
            </main>

            {/* Footer Logo */}
            <footer className="w-full py-6 flex justify-center items-center relative z-10">
                <img src="/logo.png" alt="FROM DA ECHO" className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,255,65,0.3)] opacity-80 hover:opacity-100 transition-all duration-500" />
            </footer>
        </div>
    );
}
