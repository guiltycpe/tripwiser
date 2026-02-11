-- Fix overly permissive RLS policy for shared trips.
-- The old policy allowed reading ALL trips with any non-null share_token.
-- The new approach: remove the public RLS policy entirely.
-- The shared-trip endpoint uses a service role client that bypasses RLS,
-- and filters by exact token match in the query (.eq('share_token', token)).

DROP POLICY IF EXISTS "Allow public read via share token" ON trips;
