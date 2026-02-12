'use client';

import { useEffect, useCallback, useState } from 'react';
import { getClient } from '@/lib/supabase/client';
import type { Profile, PlayerStatus } from '@/types/game';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface UseRealtimeProfileOptions {
  userId: string;
  onJammed?: (expiresAt: string) => void;
  onUnJammed?: () => void;
}

interface UseRealtimeProfileReturn {
  profile: Profile | null;
  isJammed: boolean;
  jamTimeRemaining: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to subscribe to real-time profile updates
 * Triggers callbacks when player is jammed/unjammed
 */
export function useRealtimeProfile({
  userId,
  onJammed,
  onUnJammed,
}: UseRealtimeProfileOptions): UseRealtimeProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [jamTimeRemaining, setJamTimeRemaining] = useState(0);
  
  const supabase = getClient();
  
  // Calculate if currently jammed
  const isJammed = profile?.status === 'JAMMED' && jamTimeRemaining > 0;
  
  // Fetch initial profile
  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*, team:teams(*)')
        .eq('id', userId)
        .single();
      
      if (fetchError) throw fetchError;
      setProfile(data);
      
      // Calculate initial jam time
      if (data?.status === 'JAMMED' && data.jam_expires_at) {
        const remaining = Math.max(0, 
          Math.ceil((new Date(data.jam_expires_at).getTime() - Date.now()) / 1000)
        );
        setJamTimeRemaining(remaining);
        
        if (remaining > 0) {
          onJammed?.(data.jam_expires_at);
          triggerVibration();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, supabase, onJammed]);
  
  // Handle profile updates from realtime
  const handleProfileUpdate = useCallback((
    payload: RealtimePostgresChangesPayload<Profile>
  ) => {
    const newProfile = payload.new as Profile;
    const oldProfile = payload.old as Profile;
    
    setProfile(newProfile);
    
    // Check for status change to JAMMED
    if (newProfile.status === 'JAMMED' && oldProfile?.status !== 'JAMMED') {
      if (newProfile.jam_expires_at) {
        const remaining = Math.max(0,
          Math.ceil((new Date(newProfile.jam_expires_at).getTime() - Date.now()) / 1000)
        );
        setJamTimeRemaining(remaining);
        onJammed?.(newProfile.jam_expires_at);
        triggerVibration();
      }
    }
    
    // Check for status change from JAMMED to ACTIVE
    if (newProfile.status === 'ACTIVE' && oldProfile?.status === 'JAMMED') {
      setJamTimeRemaining(0);
      onUnJammed?.();
    }
  }, [onJammed, onUnJammed]);
  
  // Setup realtime subscription
  useEffect(() => {
    if (!userId) return;
    
    fetchProfile();
    
    const channel = supabase
      .channel(`profile:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        handleProfileUpdate
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, fetchProfile, handleProfileUpdate]);
  
  // Countdown timer for jam
  useEffect(() => {
    if (jamTimeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setJamTimeRemaining(prev => {
        const next = prev - 1;
        if (next <= 0) {
          // Auto-clear jam state locally
          setProfile(p => p ? { ...p, status: 'ACTIVE' as PlayerStatus, jam_expires_at: null } : null);
          onUnJammed?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [jamTimeRemaining, onUnJammed]);
  
  return {
    profile,
    isJammed,
    jamTimeRemaining,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}

/**
 * Trigger device vibration for jam notification
 */
function triggerVibration() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    // Glitchy vibration pattern: short bursts
    navigator.vibrate([100, 50, 100, 50, 200, 100, 300]);
  }
}

