-- [2025-11-26] - Update email in Supabase Auth for Sandy Beach
-- Run this in Supabase SQL Editor to update the auth email
-- Note: This requires service role permissions

-- Update email in auth.users table
UPDATE auth.users
SET 
  email = 'tlfox125@gmail.com',
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{email}',
    '"tlfox125@gmail.com"'
  ),
  updated_at = NOW()
WHERE email = 'sandy.beach@mail.com'
  OR id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

-- Verify the update
SELECT 
  id,
  email,
  email_confirmed_at,
  raw_user_meta_data->>'firstName' as first_name,
  raw_user_meta_data->>'lastName' as last_name,
  created_at,
  updated_at
FROM auth.users
WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

