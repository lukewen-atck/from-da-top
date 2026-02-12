import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase/server';
import { verifyNtag424 } from '@/lib/ntag424';
import type { CaptureResponse, GameError } from '@/types/game';

/**
 * POST /api/game/capture
 * 
 * Captures an outpost via NFC tag tap
 * 
 * Input: NTAG 424 params (e, c) from NFC URL
 * 
 * Logic:
 * 1. Verify NTAG 424 signature
 * 2. Check User Status: If JAMMED, reject
 * 3. Check User Role: If SNIPER, reject
 * 4. Update outpost ownership
 * 5. Log the capture
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
    const { e, c } = body;
    
    if (!e || !c) {
      return NextResponse.json<GameError>(
        { code: 'INVALID_NFC', message: 'Missing NFC parameters' },
        { status: 400 }
      );
    }
    
    // Step 1: Verify NTAG 424 DNA signature
    const ntagResult = await verifyNtag424(e, c);
    
    if (!ntagResult.valid) {
      return NextResponse.json<GameError>(
        { code: 'INVALID_NFC', message: 'Invalid NFC signature' },
        { status: 400 }
      );
    }
    
    // Step 2: Get user profile and check status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, team:teams(*)')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      return NextResponse.json<GameError>(
        { code: 'NOT_AUTHORIZED', message: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Check if user is JAMMED
    if (profile.status === 'JAMMED') {
      const jamExpiresAt = profile.jam_expires_at ? new Date(profile.jam_expires_at) : null;
      const now = new Date();
      
      if (jamExpiresAt && jamExpiresAt > now) {
        const remainingSeconds = Math.ceil((jamExpiresAt.getTime() - now.getTime()) / 1000);
        return NextResponse.json<GameError>(
          { 
            code: 'SIGNAL_JAMMED', 
            message: `SIGNAL JAMMED - ${remainingSeconds}s remaining`,
            details: { remaining_seconds: remainingSeconds }
          },
          { status: 403 }
        );
      } else {
        // Jam has expired, clear it
        await supabase
          .from('profiles')
          .update({ status: 'ACTIVE', jam_expires_at: null })
          .eq('id', user.id);
      }
    }
    
    // Step 3: Check role - Snipers cannot capture
    if (profile.role === 'SNIPER') {
      return NextResponse.json<GameError>(
        { code: 'SNIPERS_CANNOT_CAPTURE', message: 'SNIPERS CANNOT CAPTURE OUTPOSTS' },
        { status: 403 }
      );
    }
    
    // Check if user has a team
    if (!profile.team_id || !profile.team) {
      return NextResponse.json<GameError>(
        { code: 'NOT_AUTHORIZED', message: 'You must join a team first' },
        { status: 403 }
      );
    }
    
    // Step 4: Find the outpost by NFC UID
    const { data: outpost, error: outpostError } = await supabase
      .from('outposts')
      .select('*, owning_team:teams(*)')
      .eq('uid', ntagResult.uid)
      .eq('is_active', true)
      .single();
    
    if (outpostError || !outpost) {
      return NextResponse.json<GameError>(
        { code: 'INVALID_NFC', message: 'Outpost not found or inactive' },
        { status: 404 }
      );
    }
    
    // Check if already owned by user's team
    if (outpost.owning_team_id === profile.team_id) {
      return NextResponse.json<CaptureResponse>({
        success: true,
        outpost: outpost,
        message: `${outpost.name} is already under your control`,
        captured_from: null,
      });
    }
    
    const previousTeamId = outpost.owning_team_id;
    const previousTeam = outpost.owning_team;
    
    // Step 5: Capture the outpost
    const { data: updatedOutpost, error: updateError } = await supabase
      .from('outposts')
      .update({
        owning_team_id: profile.team_id,
        last_captured_at: new Date().toISOString(),
        last_captured_by: user.id,
      })
      .eq('id', outpost.id)
      .select('*, owning_team:teams(*)')
      .single();
    
    if (updateError) {
      console.error('[Capture] Update error:', updateError);
      return NextResponse.json<GameError>(
        { code: 'INVALID_NFC', message: 'Failed to capture outpost' },
        { status: 500 }
      );
    }
    
    // Log the capture
    await supabase.from('capture_logs').insert({
      outpost_id: outpost.id,
      capturer_id: user.id,
      team_id: profile.team_id,
      previous_team_id: previousTeamId,
    });
    
    // Increment user's capture count
    await supabase
      .from('profiles')
      .update({ total_captures: profile.total_captures + 1 })
      .eq('id', user.id);
    
    const captureMessage = previousTeam
      ? `${outpost.name} CAPTURED from ${previousTeam.name}!`
      : `${outpost.name} CAPTURED!`;
    
    return NextResponse.json<CaptureResponse>({
      success: true,
      outpost: updatedOutpost,
      message: captureMessage,
      captured_from: previousTeam,
    });
    
  } catch (error) {
    console.error('[Capture] Unexpected error:', error);
    return NextResponse.json<GameError>(
      { code: 'INVALID_NFC', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

