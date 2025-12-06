-- [2025-11-26] - Check all partners in the system
-- This will help debug why Sandy Beach isn't showing

-- Check all partners with full details
SELECT 
  p.id as partner_id,
  p.user_id,
  au.email as auth_email,
  u.email as users_email,
  u.first_name,
  u.last_name,
  p.business_id,
  b.name as business_name,
  p.role,
  p.is_active,
  p.created_at
FROM partners p
JOIN auth.users au ON au.id = p.user_id
LEFT JOIN users u ON u.id = p.user_id
LEFT JOIN businesses b ON b.id = p.business_id
ORDER BY p.created_at DESC;

-- Check if Sandy Beach's user exists
SELECT 
  id,
  email,
  first_name,
  last_name
FROM users
WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc'
   OR email = 'tlfox125@gmail.com'
   OR email = 'sandy.beach@mail.com';

-- Check if Sandy Beach's partner record exists
SELECT *
FROM partners
WHERE user_id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

