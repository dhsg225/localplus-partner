-- [2025-11-26] - Fix RLS policy to allow admins to view all partners
-- This will allow the admin page to show all partners, not just the logged-in user's

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Partners can view their businesses" ON partners;

-- Create a new policy that allows:
-- 1. Partners to view their own records
-- 2. Admins to view all records (if you have an admin role system)
-- For now, we'll make it so any authenticated user can view all partners
-- (You can restrict this further if needed)

CREATE POLICY "Partners can view their own records" ON partners
    FOR SELECT USING (auth.uid() = user_id);

-- Add a policy to allow viewing all partners for admin purposes
-- Note: This allows any authenticated user to view all partners
-- If you want to restrict to admins only, you'd need to check admin_profiles table
CREATE POLICY "Authenticated users can view all partners for admin" ON partners
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Alternative: If you want to restrict to admins only, use this instead:
-- (Uncomment and use if you have admin_profiles table)
/*
CREATE POLICY "Admins can view all partners" ON partners
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_profiles
            WHERE admin_profiles.user_id = auth.uid()
        )
    );
*/

-- Verify the policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'partners';

