import React, { useState, useRef, useEffect } from 'react';
import { Win95Window, Win95Button } from './Win95Window';
import { validateVideoSpecs } from '../data/tasks';

export function TaskModal({ 
  isOpen, 
  onClose, 
  task, 
  song,
  onTaskComplete,
  onStartTask,
}) {
  const [step, setStep] = useState('intro'); // intro, recording, uploading, success, error
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef(null);

  // 重置狀態當彈窗關閉
  useEffect(() => {
    if (!isOpen) {
      setStep('intro');
      setError(null);
      setUploadProgress(0);
      setVideoFile(null);
      setVideoPreview(null);
    }
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const handleStartTask = () => {
    if (onStartTask) onStartTask();
    setStep('recording');
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsValidating(true);

    try {
      // 驗證影片規格
      const videoInfo = await validateVideoSpecs(file, task);
      
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setStep('preview');
      
      console.log('影片驗證通過:', videoInfo);
    } catch (err) {
      setError(err.message);
      setStep('recording');
    } finally {
      setIsValidating(false);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    setStep('uploading');
    setUploadProgress(0);

    // 模擬上傳進度
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    // 模擬上傳完成（實際應該是真正的上傳邏輯）
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // 呼叫完成回調
      const videoInfo = {
        fileName: videoFile.name,
        fileSize: videoFile.size,
        uploadTime: new Date().toISOString(),
        taskId: task.id,
      };
      
      if (onTaskComplete) {
        onTaskComplete(videoInfo);
      }
      
      setStep('success');
    }, 3000);
  };

  const handleRetry = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setError(null);
    setStep('recording');
  };

  const renderContent = () => {
    switch (step) {
      case 'intro':
        return (
          <div className="space-y-4">
            {/* 任務標題 */}
            <div className="text-center">
              <div className="text-4xl mb-2">{task.icon}</div>
              <h3 className="text-xl font-bold text-black">
                {task.name}
              </h3>
              <p className="text-sm text-gray-500">{task.subtitle}</p>
            </div>

            {/* 抽到的歌曲提示 */}
            {song && (
              <div className="bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">你抽到的歌曲</p>
                <p className="font-bold text-black">{song.title}</p>
                <p className="text-sm text-gray-600">{song.artist}</p>
              </div>
            )}

            {/* 任務說明 */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* 規格要求 */}
            <div className="border border-gray-300 rounded-lg p-3">
              <p className="text-xs font-bold text-gray-500 mb-2">📋 任務規格</p>
              <ul className="space-y-1">
                {task.specs.notes.map((note, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-cyber-green">✓</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* 按鈕 */}
            <div className="flex gap-2">
              <Win95Button onClick={onClose} className="flex-1">
                稍後再說
              </Win95Button>
              <Win95Button onClick={handleStartTask} variant="primary" className="flex-1">
                開始任務 🎬
              </Win95Button>
            </div>
          </div>
        );

      case 'recording':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-5xl mb-3">📱</div>
              <h3 className="text-lg font-bold text-black">
                上傳你的任務影片
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {task.name}
              </p>
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg text-sm">
                ❌ {error}
              </div>
            )}

            {/* 上傳區域 */}
            <div 
              className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer hover:border-neon-purple transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {isValidating ? (
                <div className="text-neon-purple">
                  <div className="animate-spin text-3xl mb-2">⚙️</div>
                  <p className="text-sm">驗證影片中...</p>
                </div>
              ) : (
                <>
                  <div className="text-4xl mb-2">📤</div>
                  <p className="text-sm text-gray-600">
                    點擊此處選擇影片
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    支援 MP4 / MOV 格式
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/mov"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* 規格提醒 */}
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-xs text-yellow-700">
                ⚠️ 請確保影片為 <strong>直式（9:16）</strong>，
                長度 <strong>{task.specs.minDuration}-{task.specs.maxDuration} 秒</strong>
              </p>
            </div>

            <Win95Button onClick={onClose} className="w-full">
              取消
            </Win95Button>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-black">
                預覽你的影片
              </h3>
            </div>

            {/* 影片預覽 */}
            <div className="bg-black rounded-lg overflow-hidden aspect-[9/16] max-h-[300px] mx-auto">
              {videoPreview && (
                <video 
                  src={videoPreview} 
                  controls 
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* 檔案資訊 */}
            <div className="text-xs text-gray-500 text-center">
              {videoFile?.name} ({(videoFile?.size / 1024 / 1024).toFixed(1)} MB)
            </div>

            {/* 按鈕 */}
            <div className="flex gap-2">
              <Win95Button onClick={handleRetry} className="flex-1">
                重新選擇
              </Win95Button>
              <Win95Button onClick={handleUpload} variant="primary" className="flex-1">
                確認上傳 ✓
              </Win95Button>
            </div>
          </div>
        );

      case 'uploading':
        return (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-5xl mb-3 animate-bounce">📡</div>
              <h3 className="text-lg font-bold text-black">
                上傳中...
              </h3>
            </div>

            {/* 進度條 */}
            <div className="bg-white border-2 border-gray-400 h-6 rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-purple to-cyber-green transition-all duration-300"
                style={{ width: `${Math.min(uploadProgress, 100)}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600">
              {Math.round(Math.min(uploadProgress, 100))}%
            </p>

            <p className="text-xs text-gray-400 text-center">
              請勿關閉此視窗
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-6xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-black">
                任務完成！
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                恭喜你解鎖了第二次抽歌機會！
              </p>
            </div>

            <div className="bg-cyber-green/20 p-4 rounded-lg text-center">
              <p className="text-cyber-green font-bold text-lg">
                +1 抽歌機會 ✨
              </p>
              <p className="text-xs text-gray-600 mt-1">
                這是你最後一次機會，請謹慎使用
              </p>
            </div>

            <Win95Button onClick={onClose} variant="primary" className="w-full">
              開始抽歌！
            </Win95Button>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-5xl mb-3">😢</div>
              <h3 className="text-lg font-bold text-black">
                上傳失敗
              </h3>
              <p className="text-sm text-red-600 mt-2">
                {error || '發生未知錯誤，請稍後再試'}
              </p>
            </div>

            <div className="flex gap-2">
              <Win95Button onClick={onClose} className="flex-1">
                取消
              </Win95Button>
              <Win95Button onClick={handleRetry} variant="primary" className="flex-1">
                重試
              </Win95Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative my-4">
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-cyber-green opacity-20 blur-3xl rounded-full" />
        
        <Win95Window 
          title={`🎯 官方任務 - ${task.name}`}
          onClose={step === 'uploading' ? undefined : onClose}
          className="relative z-10 max-w-sm"
        >
          <div className="min-w-[300px]">
            {renderContent()}
          </div>
        </Win95Window>
      </div>
    </div>
  );
}

export default TaskModal;

