-- [2025-11-26] - Verify Sandy Beach partner record and update name
-- Run this to check if the partner record exists and update name

-- First, update the user's name
UPDATE users
SET 
  first_name = 'Sandy',
  last_name = 'Beach',
  updated_at = NOW()
WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

-- Verify the partner record and user details
SELECT 
  p.id as partner_id,
  p.user_id,
  au.email,
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
WHERE p.user_id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

-- Also check all partners to see total count
SELECT COUNT(*) as total_partners FROM partners;

