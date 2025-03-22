require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkTableColumns() {
  try {
    console.log('Checking column information for profiles table...');
    
    // Using PostgreSQL information_schema to get column information
    const { data, error } = await supabase.rpc('get_column_info', { table_name: 'profiles' });
    
    if (error) {
      if (error.code === '42883') {
        console.log('The get_column_info function does not exist. Let\'s try a direct query approach.');
        await checkUsingDirectQuery();
      } else {
        console.error('Error checking columns:', error);
      }
      return;
    }
    
    console.log('Columns in profiles table:');
    console.log(data);
    
  } catch (error) {
    console.error('Unexpected error:', error);
    await checkUsingDirectQuery();
  }
}

// Fallback method using direct query
async function checkUsingDirectQuery() {
  try {
    // Attempt to check columns by querying metadata
    // This works because we only need read access to system tables
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error checking table structure:', error);
      return;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('Detected columns in profiles table:', columns);
      
      // Check for our specific columns
      const hasGoogleId = columns.includes('google_id');
      const hasAppleId = columns.includes('apple_id');
      
      console.log(`google_id column exists: ${hasGoogleId}`);
      console.log(`apple_id column exists: ${hasAppleId}`);
      
      if (hasGoogleId && hasAppleId) {
        console.log('\nSuccess! Both required columns have been added correctly.');
        console.log('You can now restart your backend server and try the authentication flow again.');
      } else {
        if (!hasGoogleId) console.log('\nWarning: google_id column is still missing!');
        if (!hasAppleId) console.log('\nWarning: apple_id column is still missing!');
        console.log('\nPlease make sure to add the missing columns as instructed.');
      }
    } else {
      console.log('No records found in the profiles table. Running additional query to check structure...');
      
      // If no records, let's try to query information schema directly
      const { data: columns, error: schemaError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'profiles');
      
      if (schemaError) {
        console.error('Error accessing schema information:', schemaError);
        console.log('\nUnable to verify column structure. Please check the Supabase dashboard directly to confirm the columns were added.');
        return;
      }
      
      if (columns && columns.length > 0) {
        const columnNames = columns.map(col => col.column_name);
        console.log('Columns in profiles table:', columnNames);
        
        const hasGoogleId = columnNames.includes('google_id');
        const hasAppleId = columnNames.includes('apple_id');
        
        console.log(`google_id column exists: ${hasGoogleId}`);
        console.log(`apple_id column exists: ${hasAppleId}`);
        
        if (hasGoogleId && hasAppleId) {
          console.log('\nSuccess! Both required columns have been added correctly.');
          console.log('You can now restart your backend server and try the authentication flow again.');
        } else {
          if (!hasGoogleId) console.log('\nWarning: google_id column is still missing!');
          if (!hasAppleId) console.log('\nWarning: apple_id column is still missing!');
          console.log('\nPlease make sure to add the missing columns as instructed.');
        }
      } else {
        console.log('Unable to retrieve column information. Please check the Supabase dashboard directly.');
      }
    }
  } catch (error) {
    console.error('Error in direct query check:', error);
  }
}

// Run the function
checkTableColumns()
  .then(() => console.log('Column check completed!'))
  .catch(err => console.error('Script error:', err)); 