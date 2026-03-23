-- [2025-12-07] - Complete SQL to check and fix Sandy's account
-- Run this in Supabase SQL Editor
-- This script will check everything and create the partner record if missing

-- ============================================
-- STEP 1: Check if Sandy's user exists
-- ============================================
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'tlfox125@gmail.com';

-- ============================================
-- STEP 2: Check if Sandy has a partner record
-- ============================================
SELECT 
  p.id as partner_id,
  p.user_id,
  p.business_id,
  p.role,
  p.is_active,
  p.accepted_at,
  p.created_at,
  u.email,
  b.name as business_name
FROM partners p
JOIN auth.users u ON p.user_id = u.id
LEFT JOIN businesses b ON p.business_id = b.id
WHERE u.email = 'tlfox125@gmail.com';

-- ============================================
-- STEP 3: Check if Shannon's Coastal Kitchen business exists
-- ============================================
SELECT 
  id,
  name,
  business_type,
  partnership_status,
  created_at
FROM businesses 
WHERE name LIKE '%Shannon%Coastal%Kitchen%' 
   OR name LIKE '%Shannon''s Coastal Kitchen%'
   OR name = 'Shannon''s Coastal Kitchen';

-- ============================================
-- STEP 4: Create partner record if missing
-- This will automatically get the user_id and business_id
-- ============================================
-- [Dec 08, 2025 - 16:55 +07] Cast permissions array to jsonb to match column type
INSERT INTO partners (user_id, business_id, role, is_active, accepted_at, created_at, permissions)
SELECT 
  u.id as user_id,
  b.id as business_id,
  'manager' as role,
  true as is_active,
  NOW() as accepted_at,
  NOW() as created_at,
  '["view_bookings","manage_bookings","view_analytics"]'::jsonb as permissions
FROM auth.users u
CROSS JOIN businesses b
WHERE u.email = 'tlfox125@gmail.com'
  AND (b.name LIKE '%Shannon%Coastal%Kitchen%' 
       OR b.name LIKE '%Shannon''s Coastal Kitchen%'
       OR b.name = 'Shannon''s Coastal Kitchen')
  AND NOT EXISTS (
    SELECT 1 
    FROM partners p 
    WHERE p.user_id = u.id 
      AND p.business_id = b.id
  )
ON CONFLICT (user_id, business_id) 
DO UPDATE SET
  is_active = true,
  accepted_at = COALESCE(partners.accepted_at, NOW()),
  role = 'manager';

-- ============================================
-- STEP 5: Verify the fix (run after Step 4)
-- ============================================
SELECT 
  p.id as partner_id,
  p.user_id,
  p.business_id,
  p.role,
  p.is_active,
  p.accepted_at,
  u.email,
  b.name as business_name
FROM partners p
JOIN auth.users u ON p.user_id = u.id
LEFT JOIN businesses b ON p.business_id = b.id
WHERE u.email = 'tlfox125@gmail.com';

