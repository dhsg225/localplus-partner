-- [2024-12-19 22:15] - Unified Authentication Database Schema
-- This schema supports all user types: consumers, partners, admins

-- Base users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consumer-specific profiles
CREATE TABLE IF NOT EXISTS consumer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{
    "language": "en",
    "currency": "THB",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false,
      "deals": true,
      "events": true,
      "reminders": true
    },
    "dietary": {
      "vegetarian": false,
      "vegan": false,
      "halal": false,
      "glutenFree": false,
      "allergies": []
    },
    "cuisinePreferences": [],
    "priceRange": {"min": 100, "max": 1000},
    "favoriteDistricts": []
  }'::jsonb,
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Admin-specific profiles
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permissions TEXT[] DEFAULT ARRAY['view_dashboard'],
  department VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User roles junction table (allows multiple roles per user)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('consumer', 'partner', 'admin', 'super_admin')),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_consumer_profiles_user_id ON consumer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Consumer profiles
CREATE POLICY "Users can view own consumer profile" ON consumer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own consumer profile" ON consumer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consumer profile" ON consumer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin profiles (only viewable by admins and the user themselves)
CREATE POLICY "Admins can view admin profiles" ON admin_profiles
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin') 
      AND is_active = true
    )
  );

-- User roles (admins can manage, users can view their own)
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage user roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin') 
      AND is_active = true
    )
  );

-- Functions for role management
CREATE OR REPLACE FUNCTION get_user_roles(user_uuid UUID)
RETURNS TEXT[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT role 
    FROM user_roles 
    WHERE user_id = user_uuid 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = user_uuid 
    AND role = role_name 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user record when auth.users is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    NEW.raw_user_meta_data->>'phone'
  );
  
  -- Auto-assign consumer role if no role specified
  IF NEW.raw_user_meta_data->>'role' IS NULL THEN
    INSERT INTO user_roles (user_id, role) VALUES (NEW.id, 'consumer');
    INSERT INTO consumer_profiles (user_id) VALUES (NEW.id);
  ELSE
    INSERT INTO user_roles (user_id, role) VALUES (NEW.id, NEW.raw_user_meta_data->>'role');
    
    -- Create appropriate profile based on role
    CASE NEW.raw_user_meta_data->>'role'
      WHEN 'consumer' THEN
        INSERT INTO consumer_profiles (user_id) VALUES (NEW.id);
      WHEN 'admin' THEN
        INSERT INTO admin_profiles (user_id) VALUES (NEW.id);
      WHEN 'super_admin' THEN
        INSERT INTO admin_profiles (user_id, permissions) 
        VALUES (NEW.id, ARRAY['view_dashboard', 'manage_businesses', 'manage_users', 'system_settings']);
      ELSE
        -- Default to consumer for unknown roles
        INSERT INTO consumer_profiles (user_id) VALUES (NEW.id);
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consumer_profiles_updated_at BEFORE UPDATE ON consumer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 