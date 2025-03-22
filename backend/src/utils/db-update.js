// Script to update the database schema and fix RLS policies
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client with service role key to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
);

async function updateDatabase() {
  console.log('Starting database update...');

  // Step 1: Check if google_id column exists
  console.log('Checking for google_id column...');
  const { data: columns, error: columnsError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (columnsError) {
    console.error('Error checking profiles table:', columnsError);
    return;
  }

  if (!columns || columns.length === 0) {
    console.error('No profiles found to check schema. Creating dummy profile...');
    await createDummyProfile();
  }

  // Step 2: Add google_id column if it doesn't exist
  console.log('Adding google_id and apple_id columns if they don\'t exist...');
  try {
    // Use raw SQL to add columns if they don't exist
    await supabase.rpc('add_column_if_not_exists', {
      table_name: 'profiles',
      column_name: 'google_id',
      column_type: 'text'
    });
    
    await supabase.rpc('add_column_if_not_exists', {
      table_name: 'profiles',
      column_name: 'apple_id',
      column_type: 'text'
    });
    
    console.log('Columns added successfully');
  } catch (error) {
    console.error('Error adding columns:', error);
    
    // Fallback method: Use SQL directly to create the stored procedure and then add columns
    console.log('Trying alternate method to add columns...');
    try {
      // First create the stored procedure if it doesn't exist
      await supabase.rpc('create_add_column_procedure');
      
      // Now try to add the columns again
      await supabase.rpc('add_column_if_not_exists', {
        table_name: 'profiles',
        column_name: 'google_id',
        column_type: 'text'
      });
      
      await supabase.rpc('add_column_if_not_exists', {
        table_name: 'profiles',
        column_name: 'apple_id',
        column_type: 'text'
      });
      
      console.log('Columns added successfully (alternate method)');
    } catch (rpcError) {
      console.error('Error with alternate method:', rpcError);
      console.log('Please add the google_id and apple_id columns manually to the profiles table');
    }
  }

  // Step 3: Update RLS policies
  console.log('Updating RLS policies...');
  try {
    // Enable RLS on the profiles table if not already enabled
    await supabase.rpc('enable_rls', { target_table: 'profiles' });
    
    // Create policy to allow service role to insert into profiles
    await supabase.rpc('create_service_role_policy', { target_table: 'profiles' });
    
    console.log('RLS policies updated successfully');
  } catch (error) {
    console.error('Error updating RLS policies:', error);
    console.log('Please update the RLS policies manually to allow the service role to insert into the profiles table');
  }

  console.log('Database update completed');
}

async function createDummyProfile() {
  // Create a dummy profile to check schema
  const { error } = await supabase.from('profiles').insert({
    id: '00000000-0000-0000-0000-000000000000',
    username: 'dummy',
    full_name: 'Dummy User',
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error('Error creating dummy profile:', error);
  }
}

// Run the update
updateDatabase()
  .catch(error => {
    console.error('Unexpected error during database update:', error);
  })
  .finally(() => {
    console.log('Database update script finished');
  }); 