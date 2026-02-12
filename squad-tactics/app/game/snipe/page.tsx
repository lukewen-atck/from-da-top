'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getClient } from '@/lib/supabase/client';
import { useRealtimeProfile } from '@/hooks/useRealtimeProfile';
import { GlitchOverlay } from '@/components/game/GlitchOverlay';
import type { SnipeResponse, GameError } from '@/types/game';

type ScanState = 'idle' | 'scanning' | 'success' | 'error';

export default function SniperPage() {
  const router = useRouter();
  const supabase = getClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [lastResult, setLastResult] = useState<SnipeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
      } else {
        router.push('/');
      }
    });
  }, [supabase, router]);
  
  // Realtime profile for jam detection
  const { 
    profile,
    isJammed, 
    jamTimeRemaining,
    isLoading: profileLoading,
  } = useRealtimeProfile({
    userId: userId || '',
  });
  
  // Check if user is a sniper
  useEffect(() => {
    if (profile && profile.role !== 'SNIPER') {
      router.push('/game');
    }
  }, [profile, router]);
  
  // Initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function initCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setScanState('scanning');
        }
      } catch (err) {
        console.error('[Camera] Init error:', err);
        setCameraError('無法啟動相機。請確保已授予相機權限。');
      }
    }
    
    if (!isJammed && !profileLoading && profile?.role === 'SNIPER') {
      initCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isJammed, profileLoading, profile]);
  
  // Handle QR code scan
  const handleScan = useCallback(async (dorsalCode: string) => {
    if (scanState !== 'scanning') return;
    
    setScanState('idle');
    setError(null);
    
    try {
      const response = await fetch('/api/game/snipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dorsal_code: dorsalCode }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const gameError = data as GameError;
        setError(gameError.message);
        setScanState('error');
        
        // Vibrate for error
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
        
        // Reset after delay
        setTimeout(() => {
          setScanState('scanning');
          setError(null);
        }, 2000);
        return;
      }
      
      const result = data as SnipeResponse;
      setLastResult(result);
      setScanState('success');
      
      // Success vibration
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 300]);
      }
      
      // Reset after delay
      setTimeout(() => {
        setScanState('scanning');
        setLastResult(null);
      }, 3000);
      
    } catch (err) {
      console.error('[Snipe] Error:', err);
      setError('Network error');
      setScanState('error');
      
      setTimeout(() => {
        setScanState('scanning');
        setError(null);
      }, 2000);
    }
  }, [scanState]);
  
  // Manual input for testing (dev mode)
  const [manualCode, setManualCode] = useState('');
  
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleScan(manualCode.trim());
      setManualCode('');
    }
  };
  
  if (profileLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-text-secondary">INITIALIZING SCANNER...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* JAM Overlay */}
      <GlitchOverlay 
        isActive={isJammed} 
        timeRemaining={jamTimeRemaining} 
      />
      
      <main className="min-h-screen bg-void-black relative overflow-hidden">
        {/* Camera View */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        </div>
        
        {/* Scanner HUD */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner brackets */}
          <div className="scanner-corner top-left" />
          <div className="scanner-corner top-right" />
          <div className="scanner-corner bottom-left" />
          <div className="scanner-corner bottom-right" />
          
          {/* Crosshair */}
          <div className="scanner-crosshair" />
          
          {/* Scanlines */}
          <div className="scanlines opacity-30" />
        </div>
        
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 glass border-b border-neon/20 z-10">
          <div className="flex items-center justify-between px-4 py-3 safe-top">
            <Link 
              href="/game"
              className="flex items-center gap-2 text-neon"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="font-mono text-sm">EXIT</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <div className={`status-dot ${scanState === 'scanning' ? 'status-active' : 'status-jammed'}`} />
              <span className="font-mono text-xs text-text-secondary uppercase">
                {scanState === 'scanning' ? 'SCANNING' : scanState.toUpperCase()}
              </span>
            </div>
          </div>
        </header>
        
        {/* Status Messages */}
        <AnimatePresence>
          {scanState === 'success' && lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="glass border border-terminal rounded-lg p-8 text-center max-w-xs mx-4">
                <div className="w-16 h-16 rounded-full bg-terminal/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-terminal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="font-display text-xl text-terminal text-glow mb-2">
                  TARGET ELIMINATED
                </h2>
                <p className="font-mono text-text-primary mb-1">
                  {lastResult.victim.display_name || 'Unknown'}
                </p>
                <p className="font-mono text-xs text-text-muted">
                  Jammed for {lastResult.jam_duration}s
                </p>
              </div>
            </motion.div>
          )}
          
          {scanState === 'error' && error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="glass border border-warning rounded-lg p-8 text-center max-w-xs mx-4">
                <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="font-display text-xl text-warning text-glow mb-2">
                  ATTACK FAILED
                </h2>
                <p className="font-mono text-text-secondary text-sm">
                  {error}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Camera Error */}
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80">
            <div className="text-center px-8">
              <svg className="w-16 h-16 text-warning mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <p className="font-mono text-warning mb-4">{cameraError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-cyber"
              >
                RETRY
              </button>
            </div>
          </div>
        )}
        
        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 glass border-t border-neon/20 z-10">
          <div className="px-4 py-6 safe-bottom">
            {/* Manual input for testing */}
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="DORSAL CODE (e.g. ON-ABC123)"
                className="flex-1 bg-bg-card border border-border-dim rounded px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon"
                disabled={isJammed}
              />
              <button
                type="submit"
                className="btn-cyber px-6"
                disabled={!manualCode.trim() || isJammed}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                </svg>
              </button>
            </form>
            
            <p className="font-mono text-xs text-text-muted text-center mt-3">
              Scan enemy QR code or enter dorsal code manually
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

