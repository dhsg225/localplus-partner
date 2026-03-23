-- [2025-12-08] - SQL queries to test Sandy's account
-- Run these in Supabase SQL Editor to verify everything

-- Test 1: Check if Sandy's user exists
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'tlfox125@gmail.com';

-- Test 2: Check if business exists
SELECT 
  id,
  name,
  partnership_status,
  created_at
FROM businesses 
WHERE name LIKE '%Shannon%Coastal%Kitchen%' 
   OR name LIKE '%Shannon''s Coastal Kitchen%';

-- Test 3: Check if partner record exists (if user exists)
-- Replace USER_ID with the ID from Test 1
-- Replace BUSINESS_ID with the ID from Test 2
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

-- Test 4: Complete check (all in one)
SELECT 
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  b.id as business_id,
  b.name as business_name,
  p.id as partner_id,
  p.role,
  p.is_active,
  p.accepted_at,
  CASE 
    WHEN u.id IS NULL THEN '❌ User does not exist'
    WHEN b.id IS NULL THEN '❌ Business does not exist'
    WHEN p.id IS NULL THEN '❌ Partner record missing'
    WHEN p.is_active = false THEN '⚠️ Partner record inactive'
    WHEN p.accepted_at IS NULL THEN '⚠️ Partner not accepted'
    ELSE '✅ All good!'
  END as status
FROM auth.users u
FULL OUTER JOIN businesses b ON (b.name LIKE '%Shannon%Coastal%Kitchen%' OR b.name LIKE '%Shannon''s Coastal Kitchen%')
FULL OUTER JOIN partners p ON p.user_id = u.id AND p.business_id = b.id
WHERE u.email = 'tlfox125@gmail.com'
   OR b.name LIKE '%Shannon%Coastal%Kitchen%';
