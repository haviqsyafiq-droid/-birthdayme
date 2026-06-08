-- Create the wishes table
CREATE TABLE wishes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read" ON wishes FOR SELECT USING (true);

-- Allow anonymous insert
CREATE POLICY "Allow anonymous insert" ON wishes FOR INSERT WITH CHECK (true);
