require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkProfilesTable() {
  try {
    console.log('Checking profiles table structure...');
    
    // Try to select from profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('Error accessing profiles table:', profilesError);
      return;
    }
    
    if (profiles && profiles.length > 0) {
      console.log('Current profiles table columns:', Object.keys(profiles[0]));
      
      // Check if google_id exists
      if (!profiles[0].hasOwnProperty('google_id')) {
        console.log('google_id column is missing. You need to add it manually in the Supabase dashboard.');
      } else {
        console.log('google_id column exists.');
      }
      
      // Check if apple_id exists
      if (!profiles[0].hasOwnProperty('apple_id')) {
        console.log('apple_id column is missing. You need to add it manually in the Supabase dashboard.');
      } else {
        console.log('apple_id column exists.');
      }
    } else {
      console.log('No records found in profiles table. Please create a test record to check structure.');
    }
    
    console.log('\nTo fix missing columns:');
    console.log('1. Go to https://app.supabase.com and sign in');
    console.log('2. Select your project (URL: https://mercswjbfadsyjsmlszv.supabase.co)');
    console.log('3. Go to Table Editor in the left sidebar');
    console.log('4. Select the "profiles" table');
    console.log('5. Click "Edit" button');
    console.log('6. Add the missing columns:');
    console.log('   - google_id (type: text, nullable: true)');
    console.log('   - apple_id (type: text, nullable: true)');
    console.log('7. Click "Save" to apply changes');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkProfilesTable()
  .then(() => console.log('Done!'))
  .catch(err => console.error('Script error:', err)); 