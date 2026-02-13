import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export function CyberToast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const borderColor = type === 'success' ? 'border-neon-green' : type === 'error' ? 'border-red-500' : 'border-neon-purple';
    const textColor = type === 'success' ? 'text-neon-green' : type === 'error' ? 'text-red-500' : 'text-neon-purple';
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className={`bg-black/90 backdrop-blur-md border ${borderColor} px-6 py-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-3 min-w-[300px]`}>
                <div className={`text-xl ${visible ? 'animate-pulse' : ''}`}>{icon}</div>
                <div className={`${textColor} font-mono font-bold tracking-wide`}>
                    {message}
                </div>
            </div>
            {/* Scanline decoration for toast */}
            <div className={`absolute -bottom-1 left-4 right-4 h-0.5 bg-${type === 'success' ? 'neon-green' : type === 'error' ? 'red-500' : 'neon-purple'} opacity-50`} />
        </div>
    );
}
