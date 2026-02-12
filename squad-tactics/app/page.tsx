'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getClient } from '@/lib/supabase/client';

export default function HomePage() {
  const router = useRouter();
  const supabase = getClient();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      
      router.push('/game');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-glitch/5 rounded-full blur-3xl" />
      </div>
      
      {/* Scanlines */}
      <div className="scanlines opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo / Title */}
        <div className="text-center mb-12">
          <motion.div
            animate={{ 
              textShadow: [
                '0 0 10px #00f0ff, 0 0 20px #00f0ff',
                '0 0 15px #00f0ff, 0 0 30px #00f0ff',
                '0 0 10px #00f0ff, 0 0 20px #00f0ff',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h1 className="font-display text-5xl font-bold text-gradient-cyber mb-2">
              RZWD
            </h1>
          </motion.div>
          <p className="font-display text-lg text-text-secondary tracking-[0.3em]">
            RADIATION
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-terminal animate-pulse" />
            <span className="font-mono text-xs text-terminal">輻射偵測中...</span>
          </div>
        </div>
        
        {/* Auth Form */}
        <div className="card-cyber card-glow p-6">
          <div className="flex mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 font-display text-sm tracking-wider border-b-2 transition-colors ${
                mode === 'login' 
                  ? 'border-neon text-neon' 
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 font-display text-sm tracking-wider border-b-2 transition-colors ${
                mode === 'signup' 
                  ? 'border-neon text-neon' 
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              REGISTER
            </button>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-text-muted block mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-elevated border border-border-dim rounded px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon transition-colors"
                placeholder="agent@rzwd.zone"
                required
              />
            </div>
            
            <div>
              <label className="font-mono text-xs text-text-muted block mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-elevated border border-border-dim rounded px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-xs text-warning text-center py-2"
              >
                {error}
              </motion.p>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-cyber w-full py-4 mt-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </div>
              ) : (
                <span>{mode === 'login' ? 'ENTER SYSTEM' : 'INITIALIZE AGENT'}</span>
              )}
            </motion.button>
          </form>
        </div>
        
        {/* Version info */}
        <p className="font-mono text-xs text-text-muted text-center mt-8">
          v0.1.0-alpha // RADIATION ZONE
        </p>
      </motion.div>
    </main>
  );
}

