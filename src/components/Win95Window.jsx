import React from 'react';

export function Win95Window({ title, children, onClose, className = '' }) {
  return (
    <div className={`win95-window w-full max-w-md mx-auto ${className}`}>
      {/* Title Bar */}
      <div className="win95-title-bar">
        <div className="flex items-center gap-2">
          <span className="text-xs">🎵</span>
          <span className="text-sm tracking-wider">{title}</span>
        </div>
        <div className="flex gap-1">
          <button className="win95-btn px-2 py-0 text-xs leading-none">_</button>
          <button className="win95-btn px-2 py-0 text-xs leading-none">□</button>
          {onClose && (
            <button 
              onClick={onClose}
              className="win95-btn px-2 py-0 text-xs leading-none hover:bg-red-500"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export function Win95Button({ children, onClick, disabled, className = '', variant = 'default' }) {
  const baseStyles = "win95-btn font-y2k text-lg transition-all";
  const variants = {
    default: "bg-[#c0c0c0] text-black",
    primary: "bg-gradient-to-b from-[#e0e0e0] to-[#a0a0a0] text-black",
    neon: "bg-black text-neon-purple border-neon-purple hover:shadow-[0_0_20px_#b829dd]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Win95ProgressBar({ progress, className = '' }) {
  return (
    <div className={`bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white h-6 ${className}`}>
      <div 
        className="h-full bg-[#000080] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default Win95Window;








