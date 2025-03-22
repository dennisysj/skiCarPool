require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkAndUpdateColumns() {
  console.log('=== Database Column Check ===');
  
  try {
    // First, check current structure to see if we need updates
    console.log('Checking profiles table structure...');
    
    // Get a sample profile to check structure
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Error querying profiles table:', error);
      return;
    }
    
    let missingColumns = [];
    
    // If there are rows, check the structure
    if (data && data.length > 0) {
      console.log('Current columns in profiles table:', Object.keys(data[0]));
      
      // Check for missing columns
      if (!('google_id' in data[0])) {
        missingColumns.push('google_id');
      }
      
      if (!('apple_id' in data[0])) {
        missingColumns.push('apple_id');
      }
    } else {
      console.log('No rows found in the profiles table. Assuming columns might be missing.');
      missingColumns = ['google_id', 'apple_id'];
    }
    
    if (missingColumns.length === 0) {
      console.log('✅ All required columns exist in the profiles table!');
      return;
    }
    
    console.log(`Missing columns detected: ${missingColumns.join(', ')}`);
    console.log('Attempting to add the missing columns...');
    
    for (const column of missingColumns) {
      console.log(`Adding ${column} column...`);
      
      // Execute raw SQL via RPC to add the column
      const { error: alterError } = await supabase.rpc('execute_sql', {
        sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ${column} TEXT DEFAULT NULL`
      });
      
      if (alterError) {
        if (alterError.code === '42883') { // Function does not exist
          console.log('The execute_sql RPC function is not available. Will try direct SQL instead.');
          
          // Alternative: Create via Supabase dashboard
          console.log('\nPlease add the missing columns manually in the Supabase dashboard:');
          console.log('1. Go to https://app.supabase.com and sign in');
          console.log('2. Select your project');
          console.log('3. Go to Table Editor in the left sidebar');
          console.log('4. Select the "profiles" table');
          console.log('5. Click "Edit" button');
          console.log('6. Add the missing columns:');
          for (const col of missingColumns) {
            console.log(`   - ${col} (type: text, nullable: true)`);
          }
          console.log('7. Click "Save" to apply changes');
          
          return;
        } else {
          console.error(`Error adding ${column} column:`, alterError);
        }
      } else {
        console.log(`✅ Successfully added ${column} column!`);
      }
    }
    
    console.log('\nVerifying column addition...');
    
    // Check again to verify the columns were added
    const { data: newData, error: newError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (newError) {
      console.error('Error verifying structure:', newError);
      return;
    }
    
    if (newData && newData.length > 0) {
      const columns = Object.keys(newData[0]);
      console.log('Updated columns in profiles table:', columns);
      
      const stillMissing = missingColumns.filter(col => !columns.includes(col));
      
      if (stillMissing.length === 0) {
        console.log('✅ All columns added successfully!');
      } else {
        console.log(`❌ Some columns still missing: ${stillMissing.join(', ')}`);
        console.log('Please add them manually through the Supabase dashboard.');
      }
    } else {
      console.log('Could not verify column addition. Please check the Supabase dashboard.');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the check and update
checkAndUpdateColumns(); 