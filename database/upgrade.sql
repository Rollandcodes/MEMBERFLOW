-- Migration to upgrade MemberFlow Database Schema

-- 1. Enhanced Members table for better segmentation
ALTER TABLE members ADD COLUMN IF NOT EXISTS tier_id TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE members ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE;

-- 2. Member Segmentation Table
CREATE TABLE IF NOT EXISTS member_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    filter_criteria JSONB NOT NULL, -- e.g., { "tier": "Pro", "status": "active" }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Webhook Events Table (to track Whop events)
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    whop_event_id TEXT UNIQUE,
    event_type TEXT NOT NULL, -- member_joined, member_cancelled, etc.
    payload JSONB NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Campaign Upgrades
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS ai_prompt TEXT; -- Stores the prompt used to generate the campaign
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS category TEXT; -- community type / niche

-- 5. Trigger-based Campaign Support
-- Current schema has 'trigger_event' in 'campaigns'. 
-- We'll ensure it supports: member_joined, member_cancelled, member_upgraded, member_inactive.

-- 6. Analytics Cache (Optional but recommended for scale)
CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    snapshot_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(user_id, metric_name, snapshot_date)
);
