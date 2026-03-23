// [2025-12-07] - Script to check and fix Sandy's account
// Run this with: node fix-sandy-account.js

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

async function checkAndFixSandyAccount() {
  console.log('🔍 Checking Sandy\'s account status...\n');

  // Step 1: Check if user exists using RPC or direct query
  console.log('Step 1: Checking if user exists...');
  
  // Try using admin API first
  let sandyUser = null;
  try {
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  
    if (!userError && users && users.users) {
      sandyUser = users.users.find(u => u.email === SANDY_EMAIL);
    }
  } catch (err) {
    console.warn('⚠️  Admin API not available, trying SQL query...');
  }

  // If admin API didn't work, try SQL query
  if (!sandyUser) {
    try {
      const { data: userData, error: sqlError } = await supabase
        .rpc('exec_sql', {
          query: `SELECT id, email, created_at, email_confirmed_at FROM auth.users WHERE email = '${SANDY_EMAIL}'`
        });
      
      if (!sqlError && userData && userData.length > 0) {
        sandyUser = {
          id: userData[0].id,
          email: userData[0].email,
          created_at: userData[0].created_at
        };
      }
    } catch (err) {
      console.warn('⚠️  SQL RPC not available, trying direct table query...');
    }
  }

  // Last resort: try querying through a view or function
  if (!sandyUser) {
    console.log('⚠️  Could not find user via admin API or SQL. User may not exist.');
    console.log('📋 Next steps:');
    console.log('   1. Check if Sandy has registered at all');
    console.log('   2. If not, she needs to register first');
    console.log('   3. If yes, check the email address is correct');
    console.log('   4. Use Supabase SQL Editor to run: SELECT * FROM auth.users WHERE email = \'tlfox125@gmail.com\';');
    return;
  }

  console.log('✅ User found:', {
    id: sandyUser.id,
    email: sandyUser.email,
    created_at: sandyUser.created_at
  });

  // Step 2: Check if business exists
  console.log('\nStep 2: Checking if business exists...');
  const { data: businesses, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .ilike('name', `%${BUSINESS_NAME}%`);

  if (businessError) {
    console.error('❌ Error fetching businesses:', businessError);
    return;
  }

  if (!businesses || businesses.length === 0) {
    console.error('❌ Business not found!');
    return;
  }

  const business = businesses[0];
  console.log('✅ Business found:', {
    id: business.id,
    name: business.name
  });

  // Step 3: Check if partner record exists
  console.log('\nStep 3: Checking if partner record exists...');
  const { data: partners, error: partnerError } = await supabase
    .from('partners')
    .select('*')
    .eq('user_id', sandyUser.id)
    .eq('business_id', business.id);

  if (partnerError) {
    console.error('❌ Error fetching partners:', partnerError);
    return;
  }

  if (partners && partners.length > 0) {
    const partner = partners[0];
    console.log('✅ Partner record exists:', {
      id: partner.id,
      role: partner.role,
      is_active: partner.is_active,
      accepted_at: partner.accepted_at
    });

    // Check if it needs fixing
    if (!partner.is_active || !partner.accepted_at) {
      console.log('\n⚠️  Partner record needs fixing...');
      const { error: updateError } = await supabase
        .from('partners')
        .update({
          is_active: true,
          accepted_at: new Date().toISOString()
        })
        .eq('id', partner.id);

      if (updateError) {
        console.error('❌ Error updating partner:', updateError);
      } else {
        console.log('✅ Partner record fixed!');
      }
    } else {
      console.log('✅ Partner record is already correct!');
    }
  } else {
    console.log('❌ Partner record NOT found!');
    console.log('\n🔧 Creating partner record...');

    const { data: newPartner, error: createError } = await supabase
      .from('partners')
      .insert({
        user_id: sandyUser.id,
        business_id: business.id,
        role: 'manager',
        is_active: true,
        accepted_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating partner:', createError);
    } else {
      console.log('✅ Partner record created successfully!', {
        id: newPartner.id,
        role: newPartner.role,
        is_active: newPartner.is_active
      });
    }
  }

  console.log('\n✅ Done!');
}

checkAndFixSandyAccount().catch(console.error);
