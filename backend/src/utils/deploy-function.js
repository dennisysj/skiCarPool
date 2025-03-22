// Script to deploy the create_profile function to Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create Supabase client with service role key to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
);

async function deployFunction() {
  console.log('Deploying create_profile function to database...');

  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create-profile-function.sql');
    const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

    // Try to execute SQL via REST API directly
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY}`,
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: sqlQuery
      })
    });

    // Check the response status
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to deploy function via REST API:', errorData);
      
      // Try alternative method
      console.log('Trying alternative method...');
      await alternativeMethod(sqlQuery);
    } else {
      console.log('Function deployed successfully via REST API');
    }
  } catch (error) {
    console.error('Error deploying function:', error);
    
    // If REST API fails, print instructions for manual deployment
    console.log('\nPlease deploy the function manually using the Supabase SQL Editor:');
    console.log('\n----------------------------------------------');
    const sqlFilePath = path.join(__dirname, 'create-profile-function.sql');
    const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');
    console.log(sqlQuery);
    console.log('----------------------------------------------\n');
  }
}

async function alternativeMethod(sqlQuery) {
  // This would use any alternative method available to execute SQL
  // For now, just print the instructions for manual deployment
  console.log('\nAlternative method failed. Please deploy the function manually using the Supabase SQL Editor:');
  console.log('\n----------------------------------------------');
  console.log(sqlQuery);
  console.log('----------------------------------------------\n');
}

// Run the deployment
deployFunction()
  .catch(error => {
    console.error('Unexpected error during deployment:', error);
  })
  .finally(() => {
    console.log('Deployment script finished');
  }); 