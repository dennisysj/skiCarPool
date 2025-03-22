require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function createTestProfile() {
  try {
    console.log('Creating a test profile record...');
    
    // Generate a valid UUID for the test user
    const testUserId = uuidv4();
    
    // Create a test profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        username: 'testuser',
        full_name: 'Test User',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating test profile:', error);
      return;
    }
    
    console.log('Test profile created successfully!');
    console.log('Profile structure:', profile);
    console.log('Available columns:', Object.keys(profile));
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
createTestProfile()
  .then(() => console.log('Done!'))
  .catch(err => console.error('Script error:', err)); 