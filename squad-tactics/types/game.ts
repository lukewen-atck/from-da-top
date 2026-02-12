// ============================================
// Project RZWD:RADIATION
// 輻射區域戰術對抗系統 - TypeScript Type Definitions
// ============================================

// ============================================
// ENUMS
// ============================================

export type PlayerRole = 'OCCUPIER' | 'SNIPER' | 'ADMIN';
export type PlayerStatus = 'ACTIVE' | 'JAMMED';
export type GameStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ENDED';

// ============================================
// DATABASE MODELS
// ============================================

export interface Team {
  id: string;
  name: string;
  color_hex: string;
  current_score: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  team_id: string | null;
  role: PlayerRole;
  status: PlayerStatus;
  jam_expires_at: string | null;
  dorsal_code: string;
  display_name: string | null;
  avatar_url: string | null;
  total_captures: number;
  total_snipes: number;
  created_at: string;
  updated_at: string;
  // Joined relations
  team?: Team;
}

// Emitter = 輻射源 (原 Outpost)
export interface Outpost {
  id: string;
  uid: string; // NTAG 424 UID
  name: string;
  location_description: string | null;
  owning_team_id: string | null;
  last_captured_at: string | null;
  last_captured_by: string | null;
  hz_per_minute: number; // Hz 頻率分數，每分鐘產生的分數
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined relations
  owning_team?: Team;
  last_capturer?: Profile;
}

// 別名：Emitter 等同於 Outpost
export type Emitter = Outpost;

export interface CombatLog {
  id: string;
  sniper_id: string;
  victim_id: string;
  sniper_team_id: string | null;
  victim_team_id: string | null;
  jam_duration_seconds: number;
  created_at: string;
  // Joined relations
  sniper?: Profile;
  victim?: Profile;
  sniper_team?: Team;
  victim_team?: Team;
}

export interface CaptureLog {
  id: string;
  outpost_id: string;
  capturer_id: string;
  team_id: string;
  previous_team_id: string | null;
  created_at: string;
  // Joined relations
  outpost?: Outpost;
  capturer?: Profile;
  team?: Team;
  previous_team?: Team;
}

export interface GameSession {
  id: string;
  name: string;
  status: GameStatus;
  started_at: string | null;
  ended_at: string | null;
  duration_minutes: number;
  winning_team_id: string | null;
  created_at: string;
  // Joined relations
  winning_team?: Team;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

// NTAG 424 DNA Params (from NFC tap)
export interface NtagParams {
  e: string; // Encrypted data
  c: string; // CMAC signature
}

// Capture API
export interface CaptureRequest {
  e: string;
  c: string;
}

export interface CaptureResponse {
  success: boolean;
  outpost: Outpost;
  message: string;
  captured_from?: Team | null;
}

// Snipe API
export interface SnipeRequest {
  dorsal_code: string;
}

export interface SnipeResponse {
  success: boolean;
  victim: {
    id: string;
    display_name: string | null;
    team: Team;
  };
  jam_duration: number;
  message: string;
}

// ============================================
// GAME STATE TYPES
// ============================================

export interface PlayerGameState {
  profile: Profile;
  team: Team;
  isJammed: boolean;
  jamTimeRemaining: number | null; // seconds
  nearbyOutposts: Outpost[];
}

export interface GameOverview {
  session: GameSession | null;
  teams: TeamScore[];
  outposts: OutpostStatus[];
  recentCombat: CombatLog[];
}

export interface TeamScore {
  team: Team;
  controlled_outposts: number;
  active_players: number;
  jammed_players: number;
}

export interface OutpostStatus {
  outpost: Outpost;
  owning_team: Team | null;
  time_held: number; // seconds
}

// ============================================
// REALTIME EVENT TYPES
// ============================================

export type RealtimeEvent = 
  | ProfileUpdateEvent
  | OutpostCaptureEvent
  | ScoreUpdateEvent;

export interface ProfileUpdateEvent {
  type: 'PROFILE_UPDATE';
  payload: {
    profile_id: string;
    status: PlayerStatus;
    jam_expires_at: string | null;
  };
}

export interface OutpostCaptureEvent {
  type: 'OUTPOST_CAPTURE';
  payload: {
    outpost_id: string;
    new_team_id: string;
    captured_by: string;
  };
}

export interface ScoreUpdateEvent {
  type: 'SCORE_UPDATE';
  payload: {
    team_id: string;
    new_score: number;
    delta: number;
  };
}

// ============================================
// UI STATE TYPES
// ============================================

export interface GlitchOverlayProps {
  isActive: boolean;
  timeRemaining: number;
  onExpire?: () => void;
}

export interface ScannerHUDProps {
  isScanning: boolean;
  lastTarget?: Profile;
  onScan: (code: string) => void;
}

export interface OutpostMarkerProps {
  outpost: Outpost;
  userTeamId: string;
  onTap?: () => void;
}

// ============================================
// ERROR TYPES
// ============================================

export type GameErrorCode = 
  | 'SIGNAL_JAMMED'
  | 'SNIPERS_CANNOT_CAPTURE'
  | 'FRIENDLY_FIRE'
  | 'INVALID_NFC'
  | 'INVALID_TARGET'
  | 'NOT_AUTHORIZED'
  | 'SESSION_EXPIRED'
  | 'GAME_NOT_ACTIVE';

export interface GameError {
  code: GameErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================
// NTAG 424 DNA TYPES
// ============================================

export interface NtagVerificationResult {
  valid: boolean;
  uid: string;
  counter: number;
  timestamp?: string;
}

export interface NtagDecryptedData {
  uid: string;
  counter: number;
  random: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type WithTimestamps<T> = T & {
  created_at: string;
  updated_at: string;
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Database insert types (without auto-generated fields)
export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'dorsal_code'> & {
  id: string; // Required as it references auth.users
  dorsal_code?: string;
};

export type TeamInsert = Omit<Team, 'id' | 'created_at' | 'updated_at' | 'current_score'>;

export type OutpostInsert = Omit<Outpost, 'id' | 'created_at' | 'updated_at'>;

// ============================================
// SUPABASE DATABASE TYPES
// ============================================

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: Team;
        Insert: TeamInsert;
        Update: Partial<TeamInsert>;
      };
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
      };
      outposts: {
        Row: Outpost;
        Insert: OutpostInsert;
        Update: Partial<OutpostInsert>;
      };
      combat_logs: {
        Row: CombatLog;
        Insert: Omit<CombatLog, 'id' | 'created_at'>;
        Update: never;
      };
      capture_logs: {
        Row: CaptureLog;
        Insert: Omit<CaptureLog, 'id' | 'created_at'>;
        Update: never;
      };
      game_sessions: {
        Row: GameSession;
        Insert: Omit<GameSession, 'id' | 'created_at'>;
        Update: Partial<Omit<GameSession, 'id' | 'created_at'>>;
      };
    };
    Enums: {
      player_role: PlayerRole;
      player_status: PlayerStatus;
      game_status: GameStatus;
    };
  };
}

