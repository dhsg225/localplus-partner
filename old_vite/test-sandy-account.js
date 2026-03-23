// [2025-12-08] - Test script to verify Sandy's account is properly set up
// Run this with: node test-sandy-account.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MjcxMCwiZXhwIjoyMDY1MjI4NzEwfQ.8Esm5KMfVJAQxHoKrEV9exsMASEFTnHfKOdqSt5cDFk';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const SANDY_EMAIL = 'tlfox125@gmail.com';
const BUSINESS_NAME = "Shannon's Coastal Kitchen";

async function testSandyAccount() {
  console.log('🧪 Testing Sandy\'s account setup...\n');
  let allChecksPassed = true;

  // Test 1: Check if user exists in users table (as Admin Panel does)
  console.log('Test 1: Checking if user exists...');
  try {
    // Check users table (what Admin Panel uses)
    const { data: usersData, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, created_at')
      .eq('email', SANDY_EMAIL)
      .single();
    
    if (userError) {
      console.error('❌ Error fetching user from users table:', userError);
      allChecksPassed = false;
    } else if (!usersData) {
      console.error('❌ User not found in users table!');
      allChecksPassed = false;
    } else {
      console.log('✅ User found in users table:', {
        id: usersData.id.substring(0, 8) + '...',
        email: usersData.email,
        name: `${usersData.first_name || ''} ${usersData.last_name || ''}`.trim() || 'N/A',
        created_at: usersData.created_at
      });
    }
  } catch (err) {
    console.error('❌ Error in Test 1:', err.message);
    allChecksPassed = false;
  }

  // Test 2: Check if business exists
  console.log('\nTest 2: Checking if business exists...');
  try {
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, partnership_status')
      .or(`name.ilike.%Shannon%Coastal%Kitchen%,name.ilike.%Shannon's Coastal Kitchen%`);

    if (businessError) {
      console.error('❌ Error fetching businesses:', businessError);
      allChecksPassed = false;
    } else if (!businesses || businesses.length === 0) {
      console.error('❌ Business not found!');
      allChecksPassed = false;
    } else {
      const business = businesses[0];
      console.log('✅ Business found:', {
        id: business.id.substring(0, 8) + '...',
        name: business.name,
        partnership_status: business.partnership_status
      });
    }
  } catch (err) {
    console.error('❌ Error in Test 2:', err.message);
    allChecksPassed = false;
  }

  // Test 3: Check if partner record exists and is active
  console.log('\nTest 3: Checking partner record...');
  try {
    // First get user ID from users table
    const { data: sandyUser, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', SANDY_EMAIL)
      .single();
    
    if (userError) {
      console.error('❌ Error fetching user:', userError);
      allChecksPassed = false;
    } else if (!sandyUser) {
      console.error('❌ Cannot check partner record - user not found');
      allChecksPassed = false;
    } else {
      // Get business ID
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .or(`name.ilike.%Shannon%Coastal%Kitchen%,name.ilike.%Shannon's Coastal Kitchen%`)
        .limit(1)
        .single();

      if (!businesses) {
        console.error('❌ Cannot check partner record - business not found');
        allChecksPassed = false;
      } else {
        const { data: partners, error: partnerError } = await supabase
          .from('partners')
          .select('*')
          .eq('user_id', sandyUser.id)
          .eq('business_id', businesses.id);

        if (partnerError) {
          console.error('❌ Error fetching partners:', partnerError);
          allChecksPassed = false;
        } else if (!partners || partners.length === 0) {
          console.error('❌ Partner record NOT found!');
          console.log('   This is the problem - Sandy needs a partner record.');
          allChecksPassed = false;
        } else {
          const partner = partners[0];
          console.log('✅ Partner record found:', {
            id: partner.id.substring(0, 8) + '...',
            role: partner.role,
            is_active: partner.is_active,
            accepted_at: partner.accepted_at || 'NOT SET',
            business_id: partner.business_id.substring(0, 8) + '...',
            user_id: partner.user_id.substring(0, 8) + '...'
          });

          // Check if it's properly configured
          if (!partner.is_active) {
            console.error('⚠️  Partner record exists but is_active = false');
            allChecksPassed = false;
          }
          if (!partner.accepted_at) {
            console.error('⚠️  Partner record exists but accepted_at is NULL');
            allChecksPassed = false;
          }
          if (partner.role !== 'manager' && partner.role !== 'owner') {
            console.warn('⚠️  Partner role is:', partner.role, '(expected manager or owner)');
          }
        }
      }
    }
  } catch (err) {
    console.error('❌ Error in Test 3:', err.message);
    allChecksPassed = false;
  }

  // Test 4: Simulate what the app would see
  console.log('\nTest 4: Simulating app access check...');
  try {
    const { data: sandyUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', SANDY_EMAIL)
      .single();
    
    if (sandyUser) {
      // Try to get partner record as the app would
      const { data: partners, error: partnerError } = await supabase
        .from('partners')
        .select(`
          *,
          businesses (
            id,
            name,
            partnership_status
          )
        `)
        .eq('user_id', sandyUser.id)
        .eq('is_active', true);

      if (partnerError) {
        console.error('❌ Error checking partner access:', partnerError);
        allChecksPassed = false;
      } else if (!partners || partners.length === 0) {
        console.error('❌ No active partner records found - Sandy cannot access features');
        allChecksPassed = false;
      } else {
        const partner = partners[0];
        console.log('✅ App would find active partner record:', {
          role: partner.role,
          business_name: partner.businesses?.name || 'N/A',
          is_active: partner.is_active,
          accepted_at: partner.accepted_at ? 'SET' : 'NOT SET'
        });
        console.log('✅ Sandy should be able to access the app!');
      }
    }
  } catch (err) {
    console.error('❌ Error in Test 4:', err.message);
    allChecksPassed = false;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allChecksPassed) {
    console.log('✅ ALL TESTS PASSED - Sandy\'s account is ready!');
    console.log('\nNext steps:');
    console.log('1. Have Sandy log out completely');
    console.log('2. Clear browser cache/localStorage (optional)');
    console.log('3. Log back in with tlfox125@gmail.com');
    console.log('4. She should now be able to access all features');
  } else {
    console.log('❌ SOME TESTS FAILED - Account needs fixing');
    console.log('\nPlease review the errors above and fix them before asking Sandy to test.');
  }
  console.log('='.repeat(50));
}

testSandyAccount().catch(console.error);
