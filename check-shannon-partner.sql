-- [2025-11-30] - Check Shannon's partner record and business_id
-- Run this in Supabase SQL Editor to see if Shannon has a partner record

-- Check if Shannon has a partner record
SELECT 
  p.id as partner_id,
  p.user_id,
  au.email as auth_email,
  u.email as users_email,
  u.first_name,
  u.last_name,
  p.business_id,
  b.name as business_name,
  p.role as partner_role,
  p.is_active,
  p.created_at
FROM partners p
JOIN auth.users au ON au.id = p.user_id
LEFT JOIN users u ON u.id = p.user_id
LEFT JOIN businesses b ON b.id = p.business_id
WHERE p.user_id = '12e35209-e85b-4d90-951f-9ed417deaeef'
   OR au.email = 'shannon.green.asia@gmail.com'
   OR u.email = 'shannon.green.asia@gmail.com';

-- Check all of Shannon's roles
SELECT 
  u.email,
  u.id as user_id,
  ur.role,
  ur.is_active,
  ur.granted_at
FROM users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email = 'shannon.green.asia@gmail.com'
   OR u.id = '12e35209-e85b-4d90-951f-9ed417deaeef'
ORDER BY ur.role;

