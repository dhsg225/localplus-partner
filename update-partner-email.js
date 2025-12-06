// [2025-11-26] - Script to update partner user email
// Usage: SUPABASE_SERVICE_ROLE_KEY=your_key node update-partner-email.js

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

// Use service role key if available for admin operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseServiceKey) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found. Using anon key - some operations may fail.');
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

// Email update details
const oldEmail = 'sandy.beach@mail.com';
const newEmail = 'tlfox125@gmail.com';

async function updatePartnerEmail() {
  try {
    console.log('🔧 Updating partner user email...');
    console.log(`📧 Old Email: ${oldEmail}`);
    console.log(`📧 New Email: ${newEmail}`);

    // Step 1: Find the user by old email
    console.log('\n1️⃣ Finding user...');
    let userId;
    
    if (supabaseServiceKey) {
      // Use admin API to find user
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;
      
      const user = usersData?.users?.find(u => u.email === oldEmail);
      if (!user) {
        throw new Error(`User with email ${oldEmail} not found`);
      }
      userId = user.id;
      console.log('✅ Found user:', userId);
    } else {
      // Try to find via users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', oldEmail)
        .single();
      
      if (userError || !userData) {
        throw new Error(`User with email ${oldEmail} not found`);
      }
      userId = userData.id;
      console.log('✅ Found user:', userId);
    }

    // Step 2: Update email in Supabase Auth
    console.log('\n2️⃣ Updating email in Supabase Auth...');
    if (supabaseServiceKey) {
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { email: newEmail }
      );
      
      if (updateError) {
        throw updateError;
      }
      console.log('✅ Email updated in auth');
    } else {
      console.warn('⚠️  Cannot update auth email without service role key. Skipping...');
    }

    // Step 3: Update email in users table
    console.log('\n3️⃣ Updating email in users table...');
    const { error: usersTableError } = await supabase
      .from('users')
      .update({ email: newEmail })
      .eq('id', userId);

    if (usersTableError) {
      throw usersTableError;
    }
    console.log('✅ Email updated in users table');

    // Step 4: Verify the update
    console.log('\n4️⃣ Verifying update...');
    const { data: verifyUser } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('id', userId)
      .single();

    if (verifyUser) {
      console.log('✅ Email update verified!');
      console.log(`   User ID: ${verifyUser.id}`);
      console.log(`   Email: ${verifyUser.email}`);
      console.log(`   Name: ${verifyUser.first_name} ${verifyUser.last_name}`);
    }

    // Step 5: Check partner record
    const { data: partnerData } = await supabase
      .from('partners')
      .select('*, businesses(*)')
      .eq('user_id', userId)
      .single();

    if (partnerData) {
      console.log(`\n✅ Partner record found:`);
      console.log(`   Business: ${partnerData.businesses?.name || 'N/A'}`);
      console.log(`   Role: ${partnerData.role}`);
    }

    console.log('\n✅ Email update completed successfully!');
    console.log(`\n📋 Updated credentials:`);
    console.log(`   Email: ${newEmail}`);
    console.log(`   Password: 123456 (unchanged)`);
    console.log(`   Partner App: http://localhost:9003`);

  } catch (error) {
    console.error('❌ Error updating email:', error);
    process.exit(1);
  }
}

updatePartnerEmail();

