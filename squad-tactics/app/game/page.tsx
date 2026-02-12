'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getClient } from '@/lib/supabase/client';
import { useRealtimeProfile } from '@/hooks/useRealtimeProfile';
import { GlitchOverlay } from '@/components/game/GlitchOverlay';
import { StatusBadge } from '@/components/game/StatusBadge';
import type { Team, Outpost } from '@/types/game';

export default function GameDashboard() {
  const router = useRouter();
  const supabase = getClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [outposts, setOutposts] = useState<Outpost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Realtime profile hook
  const { 
    profile, 
    isJammed, 
    jamTimeRemaining,
    isLoading: profileLoading,
  } = useRealtimeProfile({
    userId: userId || '',
    onJammed: () => console.log('[Dashboard] Player jammed!'),
    onUnJammed: () => console.log('[Dashboard] Player recovered!'),
  });
  
  // Fetch teams and outposts
  const fetchGameData = useCallback(async () => {
    setIsLoading(true);
    
    const [teamsRes, outpostsRes] = await Promise.all([
      supabase.from('teams').select('*').order('current_score', { ascending: false }),
      supabase.from('outposts').select('*, owning_team:teams(*)').eq('is_active', true),
    ]);
    
    if (teamsRes.data) setTeams(teamsRes.data);
    if (outpostsRes.data) setOutposts(outpostsRes.data);
    
    setIsLoading(false);
  }, [supabase]);
  
  useEffect(() => {
    fetchGameData();
    
    // Subscribe to outpost changes
    const channel = supabase
      .channel('outposts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'outposts',
      }, () => {
        fetchGameData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchGameData]);
  
  if (isLoading || profileLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-text-secondary">INITIALIZING...</p>
        </div>
      </div>
    );
  }
  
  const userTeam = profile.team;
  
  return (
    <>
      {/* JAM Overlay - blocks all interaction when jammed */}
      <GlitchOverlay 
        isActive={isJammed} 
        timeRemaining={jamTimeRemaining} 
      />
      
      <main className="min-h-screen safe-top safe-bottom">
        {/* Header */}
        <header className="glass border-b border-border-dim sticky top-0 z-50">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-display text-xl text-glow-sm text-neon">
                RZWD:RADIATION
              </h1>
              <Link 
                href="/game/profile"
                className="w-10 h-10 rounded-full bg-bg-elevated border border-border-dim flex items-center justify-center"
              >
                <span className="font-display text-sm text-text-secondary">
                  {profile.display_name?.charAt(0) || '?'}
                </span>
              </Link>
            </div>
            
            <StatusBadge 
              role={profile.role} 
              status={profile.status} 
              team={userTeam || null}
            />
          </div>
        </header>
        
        {/* Main Content */}
        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Team Scores */}
          <section>
            <h2 className="font-display text-sm text-text-muted mb-3 tracking-widest">
              頻率排行 FREQUENCY STANDINGS
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card-cyber p-4 ${team.id === profile.team_id ? 'border-glow' : ''}`}
                  style={{ 
                    borderColor: team.id === profile.team_id ? team.color_hex : undefined,
                    boxShadow: team.id === profile.team_id ? `0 0 20px ${team.color_hex}40` : undefined,
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full mb-2"
                    style={{ backgroundColor: team.color_hex, boxShadow: `0 0 10px ${team.color_hex}` }}
                  />
                  <p className="font-display text-sm text-text-secondary mb-1">{team.name}</p>
                  <p className="font-mono text-2xl text-text-primary">{team.current_score}</p>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Outposts Grid */}
          <section>
            <h2 className="font-display text-sm text-text-muted mb-3 tracking-widest">
              輻射源狀態 EMITTER STATUS
            </h2>
            <div className="space-y-3">
              {outposts.map((outpost, index) => {
                const isOwned = outpost.owning_team_id === profile.team_id;
                const ownerTeam = outpost.owning_team;
                
                return (
                  <motion.div
                    key={outpost.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-cyber p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded flex items-center justify-center"
                          style={{ 
                            backgroundColor: ownerTeam ? `${ownerTeam.color_hex}20` : 'rgba(80, 80, 112, 0.2)',
                            borderWidth: 1,
                            borderColor: ownerTeam ? ownerTeam.color_hex : 'var(--border-dim)',
                          }}
                        >
                          <svg className="w-5 h-5" style={{ color: ownerTeam?.color_hex || 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-display text-sm text-text-primary">{outpost.name}</p>
                          <p className="font-mono text-xs text-text-muted">
                            {outpost.location_description || 'Unknown Location'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {ownerTeam ? (
                          <span 
                            className="font-mono text-xs px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: `${ownerTeam.color_hex}20`,
                              color: ownerTeam.color_hex,
                            }}
                          >
                            {isOwned ? 'CONTROLLED' : ownerTeam.name}
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-text-muted px-2 py-1 rounded bg-bg-elevated">
                            NEUTRAL
                          </span>
                        )}
                        <p className="font-mono text-xs text-text-muted mt-1">
                          +{outpost.points_per_minute} Hz/min
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
          
          {/* QR Code Display (for Occupiers) */}
          {profile.role === 'OCCUPIER' && (
            <section>
              <h2 className="font-display text-sm text-text-muted mb-3 tracking-widest">
                YOUR DORSAL CODE
              </h2>
              <div className="card-cyber p-6 text-center">
                <div className="w-48 h-48 mx-auto bg-white rounded flex items-center justify-center mb-4">
                  {/* QR Code would be rendered here */}
                  <div className="text-black font-mono text-center">
                    <p className="text-xs mb-2">QR CODE</p>
                    <p className="text-lg font-bold">{profile.dorsal_code}</p>
                  </div>
                </div>
                <p className="font-mono text-sm text-warning">
                  ⚠️ KEEP THIS HIDDEN FROM ENEMY SNIPERS
                </p>
              </div>
            </section>
          )}
          
          {/* Sniper Action Button */}
          {profile.role === 'SNIPER' && (
            <section>
              <Link href="/game/snipe">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-cyber btn-danger w-full py-6 text-lg"
                  disabled={isJammed}
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                    </svg>
                    <span>ACTIVATE SCANNER</span>
                  </div>
                </motion.button>
              </Link>
            </section>
          )}
          
          {/* Stats */}
          <section>
            <h2 className="font-display text-sm text-text-muted mb-3 tracking-widest">
              YOUR STATS
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="card-cyber p-4 text-center">
                <p className="font-mono text-3xl text-neon">{profile.total_captures}</p>
                <p className="font-mono text-xs text-text-muted mt-1">CAPTURES</p>
              </div>
              <div className="card-cyber p-4 text-center">
                <p className="font-mono text-3xl text-warning">{profile.total_snipes}</p>
                <p className="font-mono text-xs text-text-muted mt-1">ELIMINATIONS</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

