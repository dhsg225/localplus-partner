# Change Sandy's Email Address

## Overview

Yes, it's possible to change Sandy's email address. The email is stored in **two places** that both need to be updated:

1. **`auth.users`** - Supabase Auth table (used for login)
2. **`users`** - Application table (used for display in Admin Panel)

## Quick Method: SQL (Recommended)

Use the SQL script: `change-sandy-email.sql`

1. Open Supabase SQL Editor
2. Open `change-sandy-email.sql`
3. Replace `NEW_EMAIL_HERE` with the new email address (in 2 places)
4. Run the queries

## Step-by-Step Instructions

### Option 1: Using SQL Script (Easiest)

1. **Open** `change-sandy-email.sql` in Supabase SQL Editor
2. **Replace** `NEW_EMAIL_HERE` with the new email (appears twice)
3. **Run** all three steps:
   - Step 1: Updates `auth.users`
   - Step 2: Updates `users` table
   - Step 3: Verifies the update

### Option 2: Using JavaScript Script

1. **Edit** `update-partner-email.js`
2. **Set** the variables at the top:
   ```javascript
   const oldEmail = 'tlfox125@gmail.com';
   const newEmail = 'new-email@example.com';
   ```
3. **Run**: `node update-partner-email.js`

### Option 3: Manual SQL (If you prefer)

Run these queries in Supabase SQL Editor (replace `NEW_EMAIL`):

```sql
-- Update auth.users
UPDATE auth.users
SET 
  email = 'NEW_EMAIL',
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{email}',
    '"NEW_EMAIL"'
  ),
  updated_at = NOW()
WHERE email = 'tlfox125@gmail.com';

-- Update users table
UPDATE users
SET 
  email = 'NEW_EMAIL',
  updated_at = NOW()
WHERE email = 'tlfox125@gmail.com';
```

## After Changing Email

1. **Sandy needs to:**
   - Log out completely
   - Log back in with the **NEW email address**
   - Use the same password

2. **Email Verification:**
   - If `email_confirmed_at` is NULL, Sandy may need to verify the new email
   - Or you can manually confirm it:
     ```sql
     UPDATE auth.users 
     SET email_confirmed_at = NOW() 
     WHERE id = '1e9ad40a-6a66-4e20-8934-17a40d0ba5dc';
     ```

3. **Verify it worked:**
   - Check Admin Panel - should show new email
   - Sandy should be able to log in with new email
   - Partner record remains intact (linked by user_id, not email)

## Important Notes

- ✅ **Partner record is safe** - It's linked by `user_id`, not email, so it won't be affected
- ✅ **Business association is safe** - Also linked by user_id
- ⚠️ **Old email won't work** - After change, only new email will work for login
- ⚠️ **Email verification** - May need to verify new email if `email_confirmed_at` is NULL

## Current Sandy Account Info

- **Old Email**: `tlfox125@gmail.com`
- **New Email**: `sandybeachthailand@gmail.com` ✅
- **User ID**: `1e9ad40a-6a66-4e20-8934-17a40d0ba5dc`
- **Name**: Sandy Beach
- **Business**: Shannon's Coastal Kitchen
- **Role**: manager

## Ready to Run

The SQL script `change-sandy-email.sql` is **ready to run** with the new email address already set!



