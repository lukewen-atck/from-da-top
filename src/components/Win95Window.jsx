import React from 'react';

export function Win95Window({ title, children, onClose, className = '' }) {
  return (
    <div className={`relative w-full max-w-md mx-auto border-2 border-neon-green bg-black/80 backdrop-blur-sm ${className}`}>
      {/* Title Bar - Cyber Style */}
      <div className="flex justify-between items-center bg-neon-green px-2 py-1 select-none">
        <div className="flex items-center gap-2">
          <span className="text-black text-xs animate-pulse">■</span>
          <span className="text-black font-bold font-mono tracking-widest text-sm uppercase">{title}</span>
        </div>
        <div className="flex gap-1">
          {onClose && (
            <button
              onClick={onClose}
              className="text-black font-bold hover:bg-black hover:text-neon-green px-1 leading-none transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 border-t border-neon-green/30">
        {children}
      </div>

      {/* Decorative Corner */}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-neon-green" />
    </div>
  );
}

export function Win95Button({ children, onClick, disabled, className = '', variant = 'default' }) {
  // Sharp edges, neon borders, hover invert
  const baseStyles = "relative font-mono font-bold py-2 px-4 transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed active:translate-y-1";

  const variants = {
    default: "bg-transparent border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black shadow-[0_0_10px_rgba(189,0,255,0.2)] hover:shadow-[0_0_20px_rgba(189,0,255,0.6)]",
    primary: "bg-neon-green border border-neon-green text-black hover:bg-transparent hover:text-neon-green shadow-[0_0_10px_rgba(0,255,65,0.2)] hover:shadow-[0_0_20px_rgba(0,255,65,0.6)]",
    neon: "bg-black text-neon-blue border border-neon-blue hover:bg-neon-blue hover:text-black shadow-[0_0_10px_rgba(0,255,255,0.2)]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </button>
  );
}

export function Win95ProgressBar({ progress, className = '' }) {
  return (
    <div className={`w-full h-4 border border-neon-green bg-black/50 p-0.5 ${className}`}>
      <div
        className="h-full bg-neon-green shadow-[0_0_10px_rgba(0,255,65,0.5)] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export const CyberWindow = Win95Window;
export const CyberButton = Win95Button;
export const CyberProgressBar = Win95ProgressBar;

export default Win95Window;








