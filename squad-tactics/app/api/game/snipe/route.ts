import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase/server';
import type { SnipeResponse, GameError } from '@/types/game';

const JAM_DURATION_SECONDS = 30;

/**
 * POST /api/game/snipe
 * 
 * Sniper attacks an enemy player by scanning their QR code
 * 
 * Input: dorsal_code from scanned QR
 * 
 * Logic:
 * 1. Verify caller is a SNIPER
 * 2. Find victim by dorsal_code
 * 3. Friendly fire check
 * 4. Immunity check (already jammed)
 * 5. Execute attack - jam the victim
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClientFromRequest(request);
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json<GameError>(
        { code: 'NOT_AUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { dorsal_code } = body;
    
    if (!dorsal_code) {
      return NextResponse.json<GameError>(
        { code: 'INVALID_TARGET', message: 'Missing target dorsal code' },
        { status: 400 }
      );
    }
    
    // Get sniper's profile
    const { data: sniper, error: sniperError } = await supabase
      .from('profiles')
      .select('*, team:teams(*)')
      .eq('id', user.id)
      .single();
    
    if (sniperError || !sniper) {
      return NextResponse.json<GameError>(
        { code: 'NOT_AUTHORIZED', message: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Step 1: Verify caller is a SNIPER
    if (sniper.role !== 'SNIPER') {
      return NextResponse.json<GameError>(
        { code: 'NOT_AUTHORIZED', message: 'Only SNIPERS can use this ability' },
        { status: 403 }
      );
    }
    
    // Check if sniper is jammed themselves
    if (sniper.status === 'JAMMED') {
      const jamExpiresAt = sniper.jam_expires_at ? new Date(sniper.jam_expires_at) : null;
      const now = new Date();
      
      if (jamExpiresAt && jamExpiresAt > now) {
        return NextResponse.json<GameError>(
          { code: 'SIGNAL_JAMMED', message: 'You are currently jammed' },
          { status: 403 }
        );
      }
    }
    
    // Step 2: Find victim by dorsal_code
    const { data: victim, error: victimError } = await supabase
      .from('profiles')
      .select('*, team:teams(*)')
      .eq('dorsal_code', dorsal_code.toUpperCase())
      .single();
    
    if (victimError || !victim) {
      return NextResponse.json<GameError>(
        { code: 'INVALID_TARGET', message: 'Target not found' },
        { status: 404 }
      );
    }
    
    // Step 3: Friendly fire check
    if (victim.team_id === sniper.team_id) {
      return NextResponse.json<GameError>(
        { code: 'FRIENDLY_FIRE', message: 'FRIENDLY FIRE DISABLED - Cannot target teammates' },
        { status: 403 }
      );
    }
    
    // Step 4: Immunity check - already jammed
    if (victim.status === 'JAMMED') {
      const jamExpiresAt = victim.jam_expires_at ? new Date(victim.jam_expires_at) : null;
      const now = new Date();
      
      if (jamExpiresAt && jamExpiresAt > now) {
        const remainingSeconds = Math.ceil((jamExpiresAt.getTime() - now.getTime()) / 1000);
        return NextResponse.json<SnipeResponse>({
          success: true,
          victim: {
            id: victim.id,
            display_name: victim.display_name,
            team: victim.team!,
          },
          jam_duration: remainingSeconds,
          message: `Target already jammed - ${remainingSeconds}s remaining`,
        });
      }
    }
    
    // Step 5: Execute attack - jam the victim
    const jamExpiresAt = new Date(Date.now() + JAM_DURATION_SECONDS * 1000).toISOString();
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        status: 'JAMMED',
        jam_expires_at: jamExpiresAt,
      })
      .eq('id', victim.id);
    
    if (updateError) {
      console.error('[Snipe] Update error:', updateError);
      return NextResponse.json<GameError>(
        { code: 'INVALID_TARGET', message: 'Failed to execute attack' },
        { status: 500 }
      );
    }
    
    // Record in combat logs
    await supabase.from('combat_logs').insert({
      sniper_id: user.id,
      victim_id: victim.id,
      sniper_team_id: sniper.team_id,
      victim_team_id: victim.team_id,
      jam_duration_seconds: JAM_DURATION_SECONDS,
    });
    
    // Increment sniper's kill count
    await supabase
      .from('profiles')
      .update({ total_snipes: sniper.total_snipes + 1 })
      .eq('id', user.id);
    
    // The victim's device will receive this update via Supabase Realtime
    // subscription on their profile row, triggering the glitch UI
    
    return NextResponse.json<SnipeResponse>({
      success: true,
      victim: {
        id: victim.id,
        display_name: victim.display_name,
        team: victim.team!,
      },
      jam_duration: JAM_DURATION_SECONDS,
      message: `TARGET ELIMINATED - ${victim.display_name || 'Unknown'} JAMMED for ${JAM_DURATION_SECONDS}s`,
    });
    
  } catch (error) {
    console.error('[Snipe] Unexpected error:', error);
    return NextResponse.json<GameError>(
      { code: 'INVALID_TARGET', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

