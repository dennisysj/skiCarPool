// Script to fix RLS policies using direct SQL queries
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client with service role key to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
);

async function fixRLSPolicies() {
  console.log('Starting RLS policy fix...');

  try {
    // Execute raw SQL to create a policy that allows all operations for the service_role
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
        -- Make sure RLS is enabled
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "profiles_service_role_policy" ON public.profiles;
        DROP POLICY IF EXISTS "Allow authenticated users to view all profiles" ON public.profiles;
        DROP POLICY IF EXISTS "Allow authenticated users to update own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Allow authenticated users to delete own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Allow service_role to do anything" ON public.profiles;
        
        -- Create policy for service_role that allows all operations
        CREATE POLICY "profiles_service_role_policy" ON public.profiles
          FOR ALL
          TO service_role
          USING (true)
          WITH CHECK (true);
          
        -- Create policy for authenticated users to view all profiles
        CREATE POLICY "Allow authenticated users to view all profiles" ON public.profiles
          FOR SELECT
          TO authenticated
          USING (true);
          
        -- Create policy for authenticated users to update own profile
        CREATE POLICY "Allow authenticated users to update own profile" ON public.profiles
          FOR UPDATE
          TO authenticated
          USING (auth.uid() = id)
          WITH CHECK (auth.uid() = id);
          
        -- Create policy for authenticated users to delete own profile
        CREATE POLICY "Allow authenticated users to delete own profile" ON public.profiles
          FOR DELETE
          TO authenticated
          USING (auth.uid() = id);
          
        -- Create policy for authenticated users to insert their own profile
        CREATE POLICY "Allow authenticated users to insert own profile" ON public.profiles
          FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = id);
      `
    });

    if (error) {
      console.error('Error executing SQL:', error);
      
      // Fallback: Try to create the exec_sql function first
      console.log('Trying to create exec_sql function...');
      await createExecSqlFunction();
      
      // Try again
      const { error: retryError } = await supabase.rpc('exec_sql', {
        sql_query: `
          -- Make sure RLS is enabled
          ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
          
          -- Drop existing policies if they exist
          DROP POLICY IF EXISTS "profiles_service_role_policy" ON public.profiles;
          
          -- Create policy for service_role that allows all operations
          CREATE POLICY "profiles_service_role_policy" ON public.profiles
            FOR ALL
            TO service_role
            USING (true)
            WITH CHECK (true);
        `
      });
      
      if (retryError) {
        console.error('Retry error:', retryError);
        console.log('Please manually update the RLS policies in the Supabase dashboard');
      } else {
        console.log('RLS policies fixed successfully (second attempt)');
      }
    } else {
      console.log('RLS policies fixed successfully');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

async function createExecSqlFunction() {
  try {
    // Create a function to execute SQL statements
    const { error } = await supabase.from('_pgrpc').select('*').limit(1);
    
    if (error) {
      console.error('Error checking _pgrpc:', error);
      
      // Try a different approach - use direct API call
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY}`
        },
        body: JSON.stringify({
          sql_query: `
            CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
            RETURNS void AS $$
            BEGIN
              EXECUTE sql_query;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
          `
        })
      });
    }
  } catch (error) {
    console.error('Error creating exec_sql function:', error);
  }
}

// Run the fix
fixRLSPolicies()
  .catch(error => {
    console.error('Script error:', error);
  })
  .finally(() => {
    console.log('RLS fix script finished');
  }); 