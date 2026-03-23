# Sandy's Registration Flow & Next Steps

## Current Status
- **User:** Sandy Beach (`tlfox125@gmail.com`)
- **Role:** `manager`
- **Business:** Shannon's Coastal Kitchen
- **Status:** Registered and visible in Admin Panel

## Registration Flow Logic

### 1. **User Registration Process**
When Sandy registered through the Partner App:

1. **Registration Form** (`RegistrationForm.tsx`)
   - User enters: email, password, business type, business name
   - Calls `authService.signUp()` → `apiService.register()`
   - API creates:
     - User account in Supabase `users` table
     - Business record in `businesses` table
     - Partner record in `partners` table (links user to business)

2. **Post-Registration**
   - User is automatically logged in
   - Session token stored in localStorage
   - Supabase session set for RLS policies
   - User redirected to Dashboard

3. **Partner Record Creation**
   - Partner record should have:
     - `user_id`: Links to Sandy's user account
     - `business_id`: Links to "Shannon's Coastal Kitchen"
     - `role`: Set to `manager` (or `owner` if first user)
     - `is_active`: Should be `true` for immediate access
     - `accepted_at`: Timestamp when partner was activated

## Potential Issues Sandy Might Be Hitting

### Issue 1: Partner Record Not Fully Activated
**Symptom:** Can't access features, seeing "No business found" errors

**Check:**
```sql
SELECT * FROM partners 
WHERE user_id = (SELECT id FROM users WHERE email = 'tlfox125@gmail.com');
```

**Verify:**
- `is_active` = `true`
- `accepted_at` is NOT NULL
- `business_id` is set correctly

**Fix if needed:**
```sql
UPDATE partners 
SET is_active = true, 
    accepted_at = NOW()
WHERE user_id = (SELECT id FROM users WHERE email = 'tlfox125@gmail.com');
```

### Issue 2: Business ID Not Linked
**Symptom:** "No business found for your account" error

**Check:**
```sql
SELECT p.*, b.name as business_name 
FROM partners p
LEFT JOIN businesses b ON p.business_id = b.id
WHERE p.user_id = (SELECT id FROM users WHERE email = 'tlfox125@gmail.com');
```

**Fix if needed:**
- If `business_id` is NULL, link to correct business:
```sql
UPDATE partners 
SET business_id = '550e8400-e29b-41d4-a716-446655440000'  -- Shannon's business ID
WHERE user_id = (SELECT id FROM users WHERE email = 'tlfox125@gmail.com');
```

### Issue 3: RLS Policy Blocking Access
**Symptom:** Can see dashboard but can't load data (bookings, events, etc.)

**Check:**
- Supabase session is properly set (check browser console for `[AUTH] ✅ Supabase session set successfully`)
- RLS policies allow `manager` role to read data

**Fix:**
- Ensure Supabase session is set after login (should happen automatically)
- Check RLS policies in Supabase dashboard for `partners` and `businesses` tables

### Issue 4: Manager Role Permissions
**Symptom:** Can access some features but not others

**Current Role Behavior:**
- `manager` role has same access as `owner` in most pages
- Both roles can access: Dashboard, Bookings, Events, Settings
- Only difference might be in admin functions

**Check:**
- No special restrictions for `manager` role in the codebase
- All pages check for partner record, not specific role

## What to Do Next

### Step 1: Verify Partner Record
Run this query in Supabase SQL Editor:
```sql
SELECT 
  u.email,
  p.role,
  p.is_active,
  p.accepted_at,
  p.business_id,
  b.name as business_name
FROM partners p
JOIN users u ON p.user_id = u.id
LEFT JOIN businesses b ON p.business_id = b.id
WHERE u.email = 'tlfox125@gmail.com';
```

**Expected Result:**
- `email`: `tlfox125@gmail.com`
- `role`: `manager` or `owner`
- `is_active`: `true`
- `accepted_at`: NOT NULL (timestamp)
- `business_id`: UUID matching Shannon's business
- `business_name`: "Shannon's Coastal Kitchen"

### Step 2: If Partner Record is Missing/Incomplete
**Option A: Manual Fix via Admin Panel**
1. Go to `/admin` page in Partner App
2. Click "+ Create Partner"
3. Enter:
   - Email: `tlfox125@gmail.com`
   - Business: Select "Shannon's Coastal Kitchen"
   - Role: `manager`
   - Is Active: ✅ checked
4. Click "Create Partner"

**Option B: SQL Fix**
```sql
-- First, get Sandy's user ID
SELECT id FROM users WHERE email = 'tlfox125@gmail.com';

-- Then update/create partner record
-- (Replace USER_ID and BUSINESS_ID with actual values)
UPDATE partners 
SET 
  business_id = '550e8400-e29b-41d4-a716-446655440000',
  role = 'manager',
  is_active = true,
  accepted_at = NOW()
WHERE user_id = 'USER_ID';

-- Or insert if doesn't exist
INSERT INTO partners (user_id, business_id, role, is_active, accepted_at)
VALUES (
  'USER_ID',
  '550e8400-e29b-41d4-a716-446655440000',
  'manager',
  true,
  NOW()
);
```

### Step 3: Test Login Flow
1. Have Sandy log out completely
2. Clear browser cache/localStorage (optional)
3. Log back in with `tlfox125@gmail.com`
4. Check browser console for:
   - `[AUTH] ✅ Supabase session set successfully`
   - Any error messages
5. Navigate through:
   - Dashboard (should load)
   - Events (should show events for Shannon's business)
   - Bookings (should show bookings)

### Step 4: Check for Specific Error Messages
Ask Sandy to:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try to access the feature that's failing
4. Share any error messages

Common errors to look for:
- `"No business found for your account"` → Partner record missing/incomplete
- `"RLS policy violation"` → Supabase session not set correctly
- `"Invalid or expired token"` → Auth token issue
- `"Failed to load events"` → API or RLS issue

## Registration API Behavior

The registration API (`apiService.register()`) should:
1. Create user in Supabase Auth
2. Create business record
3. Create partner record with:
   - `is_active = true`
   - `accepted_at = NOW()`
   - `role = 'owner'` (if first user) or `'manager'` (if added later)

**If registration didn't create partner record:**
- This is a bug in the registration API
- Need to check `/api/auth/register` endpoint
- Should create partner record automatically

## Next Actions

1. ✅ **Verify** Sandy's partner record exists and is active
2. ✅ **Fix** any missing/incomplete data
3. ✅ **Test** login and feature access
4. ✅ **Document** any specific error messages
5. ✅ **Update** registration API if partner record creation is missing

## Questions to Ask Sandy

1. What specific page/feature is she trying to access?
2. What error message (if any) does she see?
3. Can she see the Dashboard?
4. Can she see the Events page?
5. What happens when she clicks on different navigation items?
