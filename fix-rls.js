// Script to print instructions for fixing RLS policy in Supabase

console.log(`
===== FIXING ROW LEVEL SECURITY FOR PROFILES TABLE =====

The error you're seeing is due to Row Level Security (RLS) policies in Supabase 
blocking the creation of new profile rows.

Follow these steps to fix it:

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Navigate to "Authentication" → "Policies" in the sidebar
4. Look for the "profiles" table
5. You'll need to modify the RLS policies to allow new profile creation

Specifically, you need to:

A. OPTION 1 - Add a specific policy for INSERT operations:
   - Click "New Policy"
   - Select "INSERT" operation
   - Use this expression for the USING clause:
     \`auth.uid() = id\`
   - This allows new profiles to be created when the user ID matches the auth ID

B. OPTION 2 - Temporarily disable RLS for testing:
   - Click the toggle next to "RLS" to turn it off
   - (Only do this temporarily for testing, then turn it back on)

C. OPTION 3 - Check if there's a policy for "service_role" API calls:
   - Create a policy specifically for the service role
   - This allows your backend to bypass RLS when using admin keys

After making these changes, try signing up again. 
The error "violates row-level security policy" should be resolved.

For more info on Supabase RLS, visit: 
https://supabase.com/docs/guides/auth/row-level-security
`); 