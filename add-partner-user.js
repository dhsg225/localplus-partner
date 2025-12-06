// [2025-11-26] - Script to add a new partner user
// Usage: SUPABASE_SERVICE_ROLE_KEY=your_key node add-partner-user.js
// Note: Requires SUPABASE_SERVICE_ROLE_KEY environment variable for admin operations

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

// Use service role key if available for admin operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseServiceKey) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found. Using anon key - some operations may fail.');
  console.warn('   To create users programmatically, you need a service role key from Supabase dashboard.');
}

const supabase = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Partner details
const partnerEmail = 'sandy.beach@mail.com';
const partnerPassword = '123456';
const businessId = '550e8400-e29b-41d4-a716-446655440000'; // Same business as shannon.green.asia@gmail.com

async function addPartnerUser() {
  try {
    console.log('🔧 Creating partner user...');
    console.log(`📧 Email: ${partnerEmail}`);
    console.log(`🏢 Business ID: ${businessId}`);

    // Step 1: Create user in Supabase Auth
    console.log('\n1️⃣ Creating user in Supabase Auth...');
    let userId;
    
    if (supabaseServiceKey) {
      // Use admin API if service role key is available
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: partnerEmail,
        password: partnerPassword,
        email_confirm: true,
        user_metadata: {
          firstName: 'Sandy',
          lastName: 'Beach',
          role: 'partner'
        }
      });

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          console.log('⚠️  User already exists, fetching...');
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existingUser = existingUsers?.users?.find(u => u.email === partnerEmail);
          if (!existingUser) {
            throw new Error('User exists but could not be found');
          }
          userId = existingUser.id;
          console.log('✅ Found existing user:', userId);
        } else {
          throw authError;
        }
      } else {
        userId = authData.user.id;
        console.log('✅ User created in auth:', userId);
      }
    } else {
      // Fallback: Use regular signUp (requires email confirmation)
      console.log('⚠️  Using regular signUp (requires email confirmation)...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: partnerEmail,
        password: partnerPassword,
        options: {
          data: {
            firstName: 'Sandy',
            lastName: 'Beach',
            role: 'partner'
          }
        }
      });

      if (authError) {
        throw new Error(`Auth error: ${authError.message}. You may need SUPABASE_SERVICE_ROLE_KEY.`);
      }

      if (!authData.user) {
        throw new Error('User creation failed - no user returned');
      }

      userId = authData.user.id;
      console.log('✅ User created in auth:', userId);
      console.log('⚠️  Note: Email confirmation may be required');
    }

    // Step 2: Create user record in users table
    console.log('\n2️⃣ Creating user record in users table...');
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: partnerEmail,
        first_name: 'Sandy',
        last_name: 'Beach',
        is_active: true
      }, {
        onConflict: 'id'
      });

    if (userError) {
      console.warn('⚠️  Error creating user record (may already exist):', userError.message);
    } else {
      console.log('✅ User record created/updated');
    }

    // Step 3: Create partner record linking user to business
    console.log('\n3️⃣ Creating partner record...');
    const { data: partnerData, error: partnerError } = await supabase
      .from('partners')
      .upsert({
        user_id: userId,
        business_id: businessId,
        role: 'manager',
        permissions: ['view_bookings', 'manage_bookings', 'view_analytics'],
        is_active: true,
        accepted_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,business_id'
      })
      .select()
      .single();

    if (partnerError) {
      if (partnerError.code === '23505') {
        console.log('⚠️  Partner record already exists');
      } else {
        throw partnerError;
      }
    } else {
      console.log('✅ Partner record created:', partnerData.id);
    }

    // Step 4: Verify the setup
    console.log('\n4️⃣ Verifying setup...');
    const { data: verifyPartner } = await supabase
      .from('partners')
      .select('*, businesses(*)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (verifyPartner) {
      console.log('✅ Partner setup verified!');
      console.log(`   User ID: ${userId}`);
      console.log(`   Business: ${verifyPartner.businesses?.name || 'N/A'}`);
      console.log(`   Role: ${verifyPartner.role}`);
    }

    console.log('\n✅ Partner user created successfully!');
    console.log(`\n📋 Login credentials:`);
    console.log(`   Email: ${partnerEmail}`);
    console.log(`   Password: ${partnerPassword}`);
    console.log(`   Partner App: http://localhost:9003`);

  } catch (error) {
    console.error('❌ Error creating partner user:', error);
    process.exit(1);
  }
}

addPartnerUser();
