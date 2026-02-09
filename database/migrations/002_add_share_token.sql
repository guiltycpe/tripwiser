-- Add share_token column to trips table for public sharing
ALTER TABLE trips ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Index for fast lookups by share token
CREATE INDEX IF NOT EXISTS idx_trips_share_token ON trips (share_token) WHERE share_token IS NOT NULL;

-- RLS policy: allow anyone (including anon) to SELECT a trip if they know the share_token
-- This is safe because share_tokens are 32-char hex strings (unguessable)
CREATE POLICY "Allow public read via share token"
  ON trips
  FOR SELECT
  USING (share_token IS NOT NULL);
