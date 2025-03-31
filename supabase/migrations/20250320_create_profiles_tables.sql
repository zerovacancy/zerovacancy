-- Create profiles table for all user types
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  company TEXT,
  role TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_type
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);

-- Create property_teams table with exact field names matching the code
CREATE TABLE IF NOT EXISTS property_teams (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT,
  email TEXT NOT NULL,
  fullName TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  propertyCount TEXT,
  agencyType TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on role to easily identify agencies
CREATE INDEX IF NOT EXISTS idx_property_teams_role ON property_teams(role);

-- Create creators table with exact field names matching the code
CREATE TABLE IF NOT EXISTS creators (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT,
  email TEXT NOT NULL,
  fullName TEXT NOT NULL,
  phone TEXT,
  specialty TEXT NOT NULL,
  experience TEXT NOT NULL,
  portfolioUrl TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create or replace timestamp update function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamp
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_property_teams_timestamp
BEFORE UPDATE ON property_teams
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_creators_timestamp
BEFORE UPDATE ON creators
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create Row Level Security (RLS) policies - Currently disabled for development
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE creators DISABLE ROW LEVEL SECURITY;

-- Commented out policies - Will be enabled in production
/*
-- Create policies for profiles
CREATE POLICY "Users can view and update their own profile"
  ON profiles FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for property_teams
CREATE POLICY "Property teams can view and update their own profile"
  ON property_teams FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for creators
CREATE POLICY "Creators can view and update their own profile"
  ON creators FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Add service role access for all tables
CREATE POLICY "Service role has full access to profiles"
  ON profiles FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role has full access to property_teams"
  ON property_teams FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role has full access to creators"
  ON creators FOR ALL
  TO service_role
  USING (true);
*/