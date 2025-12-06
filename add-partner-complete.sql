-- [2025-11-26] - Complete partner setup for tlfox125@gmail.com
-- Run this in Supabase SQL Editor to complete the partner setup
-- The user was already created via the script, this just adds the partner record

-- Get the user ID for tlfox125@gmail.com
DO $$
DECLARE
  v_user_id UUID := '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc'; -- Known user ID
  v_business_id UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
  -- Verify user exists (using known ID)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
    RAISE EXCEPTION 'User with ID % not found', v_user_id;
  END IF;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User sandy.beach@mail.com not found';
  END IF;
  
  -- Insert partner record (bypassing RLS with service role)
  INSERT INTO partners (
    user_id,
    business_id,
    role,
    permissions,
    is_active,
    accepted_at
  ) VALUES (
    v_user_id,
    v_business_id,
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
  
  RAISE NOTICE 'Partner record created/updated for user: %', v_user_id;
END $$;

-- Verify the setup
SELECT 
  p.id as partner_id,
  p.user_id,
  u.email,
  p.business_id,
  b.name as business_name,
  p.role,
  p.is_active
FROM partners p
JOIN auth.users u ON u.id = p.user_id
LEFT JOIN businesses b ON b.id = p.business_id
WHERE u.id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc'
   OR u.email = 'tlfox125@gmail.com';

