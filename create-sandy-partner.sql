-- [2025-11-26] - Create partner record for Sandy Beach (tlfox125@gmail.com)
-- Run this in Supabase SQL Editor (runs with service role, bypasses RLS)

INSERT INTO partners (
  user_id,
  business_id,
  role,
  permissions,
  is_active,
  accepted_at
) VALUES (
  '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc', -- Sandy Beach user ID
  '550e8400-e29b-41d4-a716-446655440000', -- Business ID (same as Shannon)
  'manager',
  '["view_bookings", "manage_bookings", "view_analytics"]'::jsonb,
  true,
  NOW()
)
ON CONFLICT (user_id, business_id) 
DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  accepted_at = EXCLUDED.accepted_at,
  updated_at = NOW();

-- Verify it was created
SELECT 
  p.id as partner_id,
  u.email,
  b.name as business_name,
  p.role,
  p.is_active
FROM partners p
JOIN auth.users u ON u.id = p.user_id
LEFT JOIN businesses b ON b.id = p.business_id
WHERE u.email = 'tlfox125@gmail.com';

