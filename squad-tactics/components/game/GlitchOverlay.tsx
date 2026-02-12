'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlitchOverlayProps {
  isActive: boolean;
  timeRemaining: number;
  onExpire?: () => void;
}

export function GlitchOverlay({ isActive, timeRemaining, onExpire }: GlitchOverlayProps) {
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  
  // Random glitch intensity
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setGlitchIntensity(Math.random());
    }, 100);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  // Call onExpire when timer hits 0
  useEffect(() => {
    if (timeRemaining <= 0 && isActive) {
      onExpire?.();
    }
  }, [timeRemaining, isActive, onExpire]);
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeRemaining / 30) * circumference;
  
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="jam-overlay"
        >
          {/* Scanlines */}
          <div className="scanlines" />
          
          {/* Noise texture */}
          <div className="noise-overlay" />
          
          {/* Glitch bars */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: glitchIntensity > 0.8 
                ? `linear-gradient(
                    transparent ${Math.random() * 30}%,
                    rgba(255, 45, 85, 0.3) ${Math.random() * 10}%,
                    transparent ${Math.random() * 20}%,
                    rgba(0, 240, 255, 0.2) ${Math.random() * 5}%,
                    transparent ${100 - Math.random() * 30}%
                  )`
                : 'transparent'
            }}
          />
          
          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
            {/* Warning icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [1, 0.7, 1] 
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="mb-8"
            >
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-warning"
              >
                <path 
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            
            {/* JAMMED text with glitch effect */}
            <h1 
              className="glitch-text font-display text-5xl md:text-7xl font-bold text-warning mb-4"
              data-text="SIGNAL JAMMED"
            >
              SIGNAL JAMMED
            </h1>
            
            <p className="font-mono text-text-secondary text-lg mb-12">
              NEURAL LINK DISRUPTED
            </p>
            
            {/* Circular timer */}
            <div className="relative w-32 h-32 mb-8">
              <svg className="timer-ring w-full h-full" viewBox="0 0 100 100">
                <circle className="bg" cx="50" cy="50" r={radius} />
                <circle 
                  className="progress" 
                  cx="50" 
                  cy="50" 
                  r={radius}
                  style={{
                    strokeDashoffset: circumference - progress,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-4xl text-warning text-glow">
                  {timeRemaining}
                </span>
              </div>
            </div>
            
            <p className="font-mono text-text-muted text-sm uppercase tracking-widest">
              System Recovery In Progress...
            </p>
          </div>
          
          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-warning opacity-50" />
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-warning opacity-50" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-warning opacity-50" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-warning opacity-50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

