-- Supabase Schema for TITON POP Page Waitlist

CREATE TABLE IF NOT EXISTS waitlist_applications (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  agency_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  website TEXT,
  country TEXT NOT NULL,
  timezone TEXT NOT NULL,
  hl_status BOOLEAN DEFAULT FALSE,
  fleet_choice TEXT CHECK (fleet_choice IN ('Charter', 'Partner', 'Extended')),
  queue_position INTEGER,
  spots_remaining_at_join INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security)
ALTER TABLE waitlist_applications ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (so anyone can join the waitlist)
CREATE POLICY "Allow public inserts" ON waitlist_applications
  FOR INSERT TO public WITH CHECK (true);

-- Allow public reads (only for checking fleet counts, if necessary)
-- Alternatively, create a secure view or RPC for counts to avoid exposing emails
CREATE POLICY "Allow public select for counts" ON waitlist_applications
  FOR SELECT TO public USING (true);

-- Set up realtime for waitlist_changes
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE waitlist_applications;
