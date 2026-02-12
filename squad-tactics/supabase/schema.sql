-- ============================================
-- Project RZWD:RADIATION
-- 輻射區域戰術對抗系統 - Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TEAMS TABLE
-- Represents the competing factions (e.g., Red vs Blue)
-- ============================================
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    color_hex TEXT NOT NULL DEFAULT '#FF0000',
    current_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for leaderboard queries
CREATE INDEX idx_teams_score ON teams(current_score DESC);

-- ============================================
-- PROFILES TABLE
-- Extends Supabase auth.users with game-specific data
-- ============================================
CREATE TYPE player_role AS ENUM ('OCCUPIER', 'SNIPER', 'ADMIN');
CREATE TYPE player_status AS ENUM ('ACTIVE', 'JAMMED');

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    role player_role NOT NULL DEFAULT 'OCCUPIER',
    status player_status NOT NULL DEFAULT 'ACTIVE',
    jam_expires_at TIMESTAMPTZ,
    dorsal_code TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    total_captures INTEGER NOT NULL DEFAULT 0,
    total_snipes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_profiles_team ON profiles(team_id);
CREATE INDEX idx_profiles_dorsal ON profiles(dorsal_code);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================
-- EMITTERS TABLE (原 OUTPOSTS)
-- 輻射源 - The NFC Capture Points (NTAG 424 DNA tags)
-- 分數單位：Hz (赫茲)
-- ============================================
CREATE TABLE outposts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid TEXT UNIQUE NOT NULL, -- NTAG 424 UID
    name TEXT NOT NULL,
    location_description TEXT,
    owning_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    last_captured_at TIMESTAMPTZ,
    last_captured_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    hz_per_minute INTEGER NOT NULL DEFAULT 10, -- 每分鐘產生的 Hz 頻率分數
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_outposts_team ON outposts(owning_team_id);
CREATE INDEX idx_outposts_active ON outposts(is_active);

-- ============================================
-- COMBAT_LOGS TABLE
-- Records all sniper attacks for analytics and replays
-- ============================================
CREATE TABLE combat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sniper_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    victim_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sniper_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    victim_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    jam_duration_seconds INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX idx_combat_sniper ON combat_logs(sniper_id);
CREATE INDEX idx_combat_victim ON combat_logs(victim_id);
CREATE INDEX idx_combat_time ON combat_logs(created_at DESC);

-- ============================================
-- CAPTURE_LOGS TABLE
-- Records all outpost captures for analytics
-- ============================================
CREATE TABLE capture_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outpost_id UUID NOT NULL REFERENCES outposts(id) ON DELETE CASCADE,
    capturer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    previous_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_capture_outpost ON capture_logs(outpost_id);
CREATE INDEX idx_capture_player ON capture_logs(capturer_id);
CREATE INDEX idx_capture_time ON capture_logs(created_at DESC);

-- ============================================
-- GAME_SESSIONS TABLE
-- Track game rounds/matches
-- ============================================
CREATE TYPE game_status AS ENUM ('PENDING', 'ACTIVE', 'PAUSED', 'ENDED');

CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status game_status NOT NULL DEFAULT 'PENDING',
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    winning_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE outposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE capture_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- TEAMS: Everyone can read, only admins can modify
CREATE POLICY "Teams are viewable by everyone" 
    ON teams FOR SELECT 
    USING (true);

CREATE POLICY "Admins can manage teams" 
    ON teams FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'ADMIN'
        )
    );

-- PROFILES: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" 
    ON profiles FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'ADMIN'
        )
    );

-- Service role can insert profiles (for auth trigger)
CREATE POLICY "Service role can insert profiles"
    ON profiles FOR INSERT
    WITH CHECK (true);

-- OUTPOSTS: Everyone can read, authenticated can update ownership
CREATE POLICY "Outposts are viewable by everyone" 
    ON outposts FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can capture outposts" 
    ON outposts FOR UPDATE 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage outposts" 
    ON outposts FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'ADMIN'
        )
    );

-- COMBAT_LOGS: Everyone can read, snipers can insert
CREATE POLICY "Combat logs are viewable by everyone" 
    ON combat_logs FOR SELECT 
    USING (true);

CREATE POLICY "Snipers can create combat logs" 
    ON combat_logs FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'SNIPER'
        )
    );

-- CAPTURE_LOGS: Everyone can read
CREATE POLICY "Capture logs are viewable by everyone" 
    ON capture_logs FOR SELECT 
    USING (true);

CREATE POLICY "Occupiers can create capture logs" 
    ON capture_logs FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'OCCUPIER'
        )
    );

-- GAME_SESSIONS: Everyone can read, admins manage
CREATE POLICY "Game sessions are viewable by everyone" 
    ON game_sessions FOR SELECT 
    USING (true);

CREATE POLICY "Admins can manage game sessions" 
    ON game_sessions FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'ADMIN'
        )
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_outposts_updated_at
    BEFORE UPDATE ON outposts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to auto-clear JAMMED status when expired
CREATE OR REPLACE FUNCTION clear_expired_jams()
RETURNS void AS $$
BEGIN
    UPDATE profiles 
    SET status = 'ACTIVE', jam_expires_at = NULL
    WHERE status = 'JAMMED' 
    AND jam_expires_at IS NOT NULL 
    AND jam_expires_at <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique dorsal code
CREATE OR REPLACE FUNCTION generate_dorsal_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := 'RZ-';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate dorsal_code on profile creation
CREATE OR REPLACE FUNCTION set_dorsal_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.dorsal_code IS NULL OR NEW.dorsal_code = '' THEN
        NEW.dorsal_code := generate_dorsal_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profile_dorsal_code
    BEFORE INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION set_dorsal_code();

-- Function to handle new user signup (auto-create profile)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url, dorsal_code)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url',
        generate_dorsal_code()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users to auto-create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- Enable realtime for specific tables
-- ============================================

-- Note: Run these in Supabase Dashboard > Database > Replication
-- ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
-- ALTER PUBLICATION supabase_realtime ADD TABLE outposts;
-- ALTER PUBLICATION supabase_realtime ADD TABLE teams;

-- ============================================
-- SEED DATA (Development Only)
-- ============================================

-- Insert default teams
INSERT INTO teams (id, name, color_hex) VALUES
    ('11111111-1111-1111-1111-111111111111', 'RED PHANTOM', '#FF2D55'),
    ('22222222-2222-2222-2222-222222222222', 'BLUE SPECTER', '#007AFF')
ON CONFLICT (id) DO NOTHING;

-- Insert sample emitters (輻射源)
INSERT INTO outposts (uid, name, location_description, hz_per_minute) VALUES
    ('04A1B2C3D4E5F6', 'EMITTER-α', '主入口區域', 15),
    ('04B2C3D4E5F6A1', 'EMITTER-β', '東翼終端', 10),
    ('04C3D4E5F6A1B2', 'EMITTER-γ', '西翼終端', 10),
    ('04D4E5F6A1B2C3', 'EMITTER-δ', '控制室', 20),
    ('04E5F6A1B2C3D4', 'EMITTER-ε', '屋頂通道', 25)
ON CONFLICT (uid) DO NOTHING;

