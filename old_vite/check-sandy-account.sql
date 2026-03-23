-- [2025-12-07] - Check Sandy's account status and create partner record if missing
-- Run this in Supabase SQL Editor

-- Step 1: Check if Sandy's user exists
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'tlfox125@gmail.com';

-- Step 2: Check if Sandy has a partner record
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

-- Step 3: Check if Shannon's Coastal Kitchen business exists
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

-- Step 4: If partner record is missing, create it
-- First, get the IDs (replace with actual values from queries above)
-- Then run this INSERT:

/*
-- Get Sandy's user ID (from Step 1)
-- Get Shannon's business ID (from Step 3)
-- Then run:

INSERT INTO partners (user_id, business_id, role, is_active, accepted_at, created_at)
VALUES (
  'USER_ID_FROM_STEP_1',  -- Replace with actual user ID
  'BUSINESS_ID_FROM_STEP_3',  -- Replace with actual business ID
  'manager',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (user_id, business_id) 
DO UPDATE SET
  is_active = true,
  accepted_at = COALESCE(partners.accepted_at, NOW()),
  role = 'manager';
*/
