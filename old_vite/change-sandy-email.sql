-- [2025-12-08] - Change Sandy's email address
-- Run this in Supabase SQL Editor
-- Changing from: tlfox125@gmail.com
-- Changing to: sandybeachthailand@gmail.com

-- IMPORTANT: Email is stored in TWO places:
-- 1. auth.users (Supabase Auth - for login)
-- 2. users (application table - for display)

-- ============================================
-- STEP 1: Update email in auth.users (Supabase Auth)
-- ============================================
-- This is where Supabase checks for login
UPDATE auth.users
SET 
  email = 'sandybeachthailand@gmail.com',
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{email}',
    '"sandybeachthailand@gmail.com"'
  ),
  updated_at = NOW()
WHERE email = 'tlfox125@gmail.com'  -- Current email
  OR id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';  -- Sandy's user ID

-- ============================================
-- STEP 2: Update email in users table (Application table)
-- ============================================
-- This is what the Admin Panel and app displays
UPDATE users
SET 
  email = 'sandybeachthailand@gmail.com',
  updated_at = NOW()
WHERE email = 'tlfox125@gmail.com'  -- Current email
  OR id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';  -- Sandy's user ID

-- ============================================
-- STEP 3: Verify the update
-- ============================================
-- Check auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users
WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

-- Check users table
SELECT 
  id,
  email,
  first_name,
  last_name,
  created_at,
  updated_at
FROM users
WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

-- ============================================
-- NOTES:
-- ============================================
-- 1. After changing email, Sandy will need to:
--    - Log out completely
--    - Log back in with the NEW email
--    - May need to verify the new email (check email_confirmed_at)
--
-- 2. If email_confirmed_at is NULL after update:
--    - Sandy will need to verify the new email
--    - Or you can manually set it:
--      UPDATE auth.users SET email_confirmed_at = NOW() WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';
--
-- 3. Partner record is linked by user_id, not email, so it will remain intact
