-- [2025-12-08] - Merge Sandy's two accounts
-- Run this in Supabase SQL Editor
-- Merging: tlfox125@gmail.com (ID: 1e9ad40a-6a66-4e20-8934-17a40d0ba5dc) 
--    INTO: sandybeachthailand@gmail.com (target account)

-- ============================================
-- STEP 0: Identify both accounts
-- ============================================
-- Check the account we're merging FROM (tlfox125@gmail.com)
SELECT 
  'SOURCE ACCOUNT (tlfox125@gmail.com)' as account_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users
WHERE email = 'tlfox125@gmail.com'
   OR id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

-- Check the account we're merging TO (sandybeachthailand@gmail.com)
SELECT 
  'TARGET ACCOUNT (sandybeachthailand@gmail.com)' as account_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users
WHERE email = 'sandybeachthailand@gmail.com';

-- Check what data exists in users table for both accounts
SELECT 
  'users table - SOURCE' as table_type,
  id,
  email,
  first_name,
  last_name,
  created_at,
  updated_at
FROM users
WHERE email = 'tlfox125@gmail.com'
   OR id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

SELECT 
  'users table - TARGET' as table_type,
  id,
  email,
  first_name,
  last_name,
  created_at,
  updated_at
FROM users
WHERE email = 'sandybeachthailand@gmail.com';

-- Check partner records for both accounts
SELECT 
  'partners - SOURCE' as record_type,
  p.id as partner_id,
  p.user_id,
  p.business_id,
  p.role,
  p.is_active,
  u.email
FROM partners p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'tlfox125@gmail.com'
   OR u.id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

SELECT 
  'partners - TARGET' as record_type,
  p.id as partner_id,
  p.user_id,
  p.business_id,
  p.role,
  p.is_active,
  u.email
FROM partners p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'sandybeachthailand@gmail.com';

-- ============================================
-- STEP 1: Get the target account ID
-- ============================================
-- We need to store the target account ID in a variable
-- For now, we'll use a subquery. Replace TARGET_USER_ID in steps below with:
-- (SELECT id FROM auth.users WHERE email = 'sandybeachthailand@gmail.com' LIMIT 1)

-- ============================================
-- STEP 2: Migrate partner records
-- ============================================
-- Update all partner records from source account to target account
-- This ensures business associations are preserved
UPDATE partners
SET 
  user_id = (SELECT id FROM auth.users WHERE email = 'sandybeachthailand@gmail.com' LIMIT 1),
  updated_at = NOW()
WHERE user_id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc'
   OR user_id IN (SELECT id FROM auth.users WHERE email = 'tlfox125@gmail.com');

-- ============================================
-- STEP 3: Merge user data in users table
-- ============================================
-- If target account doesn't have complete data, copy from source
-- Update target account with any missing data from source
UPDATE users
SET 
  first_name = COALESCE(
    users.first_name,
    (SELECT first_name FROM users WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc' OR email = 'tlfox125@gmail.com' LIMIT 1)
  ),
  last_name = COALESCE(
    users.last_name,
    (SELECT last_name FROM users WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc' OR email = 'tlfox125@gmail.com' LIMIT 1)
  ),
  updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'sandybeachthailand@gmail.com' LIMIT 1);

-- ============================================
-- STEP 4: Delete source account from users table
-- ============================================
-- Remove the old account from users table
DELETE FROM users
WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc'
   OR (email = 'tlfox125@gmail.com' AND id != (SELECT id FROM auth.users WHERE email = 'sandybeachthailand@gmail.com' LIMIT 1));

-- ============================================
-- STEP 5: Delete source account from auth.users
-- ============================================
-- Remove the old account from Supabase Auth
-- WARNING: This permanently deletes the account
DELETE FROM auth.users
WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc'
   OR (email = 'tlfox125@gmail.com' AND id != (SELECT id FROM auth.users WHERE email = 'sandybeachthailand@gmail.com' LIMIT 1));

-- ============================================
-- STEP 6: Verify the merge
-- ============================================
-- Check that target account now has all the data
SELECT 
  'FINAL CHECK - auth.users' as check_type,
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at
FROM auth.users u
WHERE u.email = 'sandybeachthailand@gmail.com';

SELECT 
  'FINAL CHECK - users table' as check_type,
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.created_at
FROM users u
WHERE u.email = 'sandybeachthailand@gmail.com';

SELECT 
  'FINAL CHECK - partners' as check_type,
  p.id as partner_id,
  p.user_id,
  p.business_id,
  p.role,
  p.is_active,
  u.email,
  b.name as business_name
FROM partners p
JOIN auth.users u ON p.user_id = u.id
LEFT JOIN businesses b ON p.business_id = b.id
WHERE u.email = 'sandybeachthailand@gmail.com';

-- Verify old account is gone
SELECT 
  'VERIFY DELETION - Should return 0 rows' as check_type,
  COUNT(*) as remaining_accounts
FROM auth.users
WHERE email = 'tlfox125@gmail.com'
   OR id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';

-- ============================================
-- NOTES:
-- ============================================
-- 1. After merge, Sandy should log in with: sandybeachthailand@gmail.com
-- 2. All partner records and business associations are preserved
-- 3. The old account (tlfox125@gmail.com) is permanently deleted
-- 4. If email_confirmed_at is NULL, Sandy may need to verify the email
-- 5. If there are other tables with user_id foreign keys, they need to be updated too
--
-- IMPORTANT: Review STEP 0 results before proceeding!
-- Make sure you understand what data will be merged and what will be deleted.
