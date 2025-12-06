-- [2025-11-26] - Debug why Sandy Beach isn't showing in admin page
-- Run this to check everything

-- 1. Check if partner record exists
SELECT 
  'Partner Record Check' as check_type,
  p.id as partner_id,
  p.user_id,
  p.business_id,
  p.role,
  p.is_active,
  p.created_at
FROM partners p
WHERE p.user_id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

-- 2. Check if user exists in users table
SELECT 
  'User Record Check' as check_type,
  id,
  email,
  first_name,
  last_name,
  is_active
FROM users
WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

-- 3. Check if user exists in auth.users
SELECT 
  'Auth User Check' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

-- 4. Check ALL partners (what the admin page should see)
SELECT 
  'All Partners' as check_type,
  p.id as partner_id,
  p.user_id,
  au.email as auth_email,
  u.email as users_email,
  u.first_name,
  u.last_name,
  p.business_id,
  b.name as business_name,
  p.role,
  p.is_active
FROM partners p
JOIN auth.users au ON au.id = p.user_id
LEFT JOIN users u ON u.id = p.user_id
LEFT JOIN businesses b ON b.id = p.business_id
ORDER BY p.created_at DESC;

-- 5. Count total partners
SELECT 
  'Count' as check_type,
  COUNT(*) as total_partners,
  COUNT(*) FILTER (WHERE is_active = true) as active_partners
FROM partners;

