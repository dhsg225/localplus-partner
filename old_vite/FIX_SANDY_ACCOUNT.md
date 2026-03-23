# Fix Sandy's Account - Step by Step Guide

## Status: Registration Endpoint Deployed ✅

The registration endpoint has been committed and pushed to the repository. It will auto-deploy on Vercel.

## Step 1: Check Sandy's Current Status

### Option A: Via Admin Panel (Easiest)
1. Go to `http://localhost:9003/admin` (or production URL)
2. Search for `tlfox125@gmail.com` in the search box
3. Check if Sandy appears in the list:
   - ✅ **If she appears**: Check if `is_active` is `true` and `accepted_at` is set
   - ❌ **If she doesn't appear**: Her partner record is missing - proceed to Step 2

### Option B: Via Supabase SQL Editor
Run this query in Supabase SQL Editor:

```sql
-- Check Sandy's partner record
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
```

**Expected Result:**
- If query returns a row: Partner record exists ✅
- If query returns no rows: Partner record is missing ❌

## Step 2: Fix Sandy's Account

### If Partner Record is Missing:

#### Option A: Via Admin Panel (Recommended)
1. Go to `/admin` page
2. Click "+ Create Partner" button
3. Fill in the form:
   - **Email**: `tlfox125@gmail.com`
   - **Business**: Select "Shannon's Coastal Kitchen" from dropdown
   - **Role**: `manager`
   - **Is Active**: ✅ Checked
4. Click "Create Partner"
5. Verify Sandy appears in the list

#### Option B: Via SQL (If Admin Panel doesn't work)
Run this in Supabase SQL Editor (replace IDs with actual values):

```sql
-- First, get Sandy's user ID
SELECT id FROM auth.users WHERE email = 'tlfox125@gmail.com';

-- Get Shannon's business ID
SELECT id, name FROM businesses 
WHERE name LIKE '%Shannon%Coastal%Kitchen%' 
   OR name = 'Shannon''s Coastal Kitchen';

-- Then create partner record (replace USER_ID and BUSINESS_ID)
INSERT INTO partners (user_id, business_id, role, is_active, accepted_at, created_at)
VALUES (
  'USER_ID',  -- Replace with Sandy's user ID from first query
  'BUSINESS_ID',  -- Replace with business ID from second query
  'manager',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (user_id, business_id) 
DO UPDATE SET
  is_active = true,
  accepted_at = COALESCE(partners.accepted_at, NOW());
```

### If Partner Record Exists but is Inactive:

Run this SQL to fix it:

```sql
UPDATE partners 
SET 
  is_active = true,
  accepted_at = COALESCE(accepted_at, NOW())
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'tlfox125@gmail.com');
```

## Step 3: Verify the Fix

1. Have Sandy log out completely
2. Clear browser cache/localStorage (optional but recommended)
3. Log back in with `tlfox125@gmail.com`
4. Check browser console for:
   - `[AUTH] ✅ Supabase session set successfully`
   - No error messages
5. Navigate through the app:
   - ✅ Dashboard should load
   - ✅ Events page should show events for Shannon's business
   - ✅ Bookings page should work
   - ✅ All features should be accessible

## Step 4: Test New Registration

To verify the registration endpoint works for future users:

1. Register a new test user:
   - Email: `test-registration@example.com`
   - Password: `testpassword123`
   - Business Type: Any
   - Business Name: `Test Business`

2. Check in Admin Panel:
   - New user should appear
   - Partner record should exist
   - `is_active` should be `true`
   - `accepted_at` should be set

3. Log in as new user:
   - Should be able to access all features immediately

## Troubleshooting

### Issue: "No business found for your account"
**Solution**: Partner record is missing or `business_id` is NULL
- Fix: Create partner record (Step 2)

### Issue: "RLS policy violation"
**Solution**: Supabase session not set correctly
- Fix: Have user log out and log back in
- Check browser console for session errors

### Issue: "User not found" when creating partner
**Solution**: User might be in `auth.users` but not in `users` table
- Fix: The Admin Panel queries `users` table, but registration creates in `auth.users`
- Need to check if there's a trigger that syncs `auth.users` to `users` table

### Issue: Admin Panel can't create partner
**Solution**: RLS policies might be blocking
- Fix: Use SQL Editor with service role (Option B in Step 2)

## Summary

✅ **Registration endpoint**: Deployed and ready at `/api/auth/register`
⏳ **Sandy's account**: Needs verification - script could not find user account
⏳ **Testing**: Should be done after fixing Sandy's account

## Current Status (2025-12-07)

### ✅ Completed
1. Registration endpoint created at `/localplus-api/auth/register/route.js`
2. Endpoint automatically creates:
   - User account in Supabase Auth
   - Business record
   - Partner record (links user to business)
3. Documentation created (this file, REGISTRATION_API_FIX.md, SANDY_REGISTRATION_FLOW.md)

### ⏳ In Progress
1. **Sandy's account check**: Script could not find user with email `tlfox125@gmail.com`
   - Possible reasons:
     - User hasn't registered yet
     - Email address is different
     - User exists but script method didn't work

### 📋 Immediate Next Steps

**Option 1: Use Admin Panel (Recommended)**
1. Go to `http://localhost:9003/admin` (or production URL)
2. Search for `tlfox125@gmail.com` in the search box
3. **If Sandy appears**: 
   - Check if `is_active = true` and `accepted_at` is set
   - If not, click to edit and activate
4. **If Sandy doesn't appear**:
   - Click "+ Create Partner" button
   - Enter email: `tlfox125@gmail.com`
   - Select business: "Shannon's Coastal Kitchen"
   - Role: `manager`
   - Is Active: ✅ Checked
   - Click "Create Partner"

**Option 2: Use Supabase SQL Editor**
1. Go to Supabase Dashboard → SQL Editor
2. Run the queries from `check-sandy-account.sql`
3. If user doesn't exist, Sandy needs to register first
4. If user exists but no partner record, run the INSERT from Step 4

**Option 3: Have Sandy Register Again**
- If Sandy's account doesn't exist, she can register again
- The new registration endpoint will automatically create the partner record
- Use email: `tlfox125@gmail.com` (or verify the correct email)

## Next Actions

1. ✅ Registration endpoint committed and pushed
2. ⏳ **URGENT**: Check Sandy's account status (use Admin Panel or SQL)
3. ⏳ Fix Sandy's account if partner record is missing
4. ⏳ Test registration with new user (after Vercel deployment completes)
5. ⏳ Verify Sandy can access all features
