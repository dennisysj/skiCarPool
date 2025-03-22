require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkDb() {
  console.log('Checking the database structure...');
  
  try {
    // Try to get the profile table structure by querying for a record
    // This should work even with RLS because we're using the service role key
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying profiles table:', error);
      return;
    }
    
    // If there's data, we can check the structure
    if (data && data.length > 0) {
      console.log('Found a record in profiles. Columns:', Object.keys(data[0]));
      
      const hasGoogleId = 'google_id' in data[0];
      const hasAppleId = 'apple_id' in data[0];
      
      console.log(`Has google_id column: ${hasGoogleId}`);
      console.log(`Has apple_id column: ${hasAppleId}`);
      
      if (hasGoogleId && hasAppleId) {
        console.log('✅ Success! Both columns have been added.');
      } else {
        console.log('❌ One or both columns are still missing.');
      }
    } else {
      console.log('No records found in profiles table. Cannot check structure directly.');
      
      // Try another approach - describe the table
      console.log('Attempting to check using a different method...');
      
      // Since we can't create records due to RLS, let's restart the backend
      // and see if it still reports missing columns
      console.log('\nRecommendation:');
      console.log('1. Make sure you\'ve added both columns in the Supabase dashboard');
      console.log('2. Restart your backend server with: npm start');
      console.log('3. Try the Google authentication flow again');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the check
checkDb()
  .then(() => console.log('Check completed'))
  .catch(err => console.error('Error running check:', err)); 