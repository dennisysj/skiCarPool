/**
 * Script to fix RLS issues by updating the Supabase client to use service role key
 */

console.log(`
===== FIXING SUPABASE AUTH ISSUES =====

Your backend is encountering Row Level Security (RLS) issues when creating user profiles.
Here's how to fix it by using a service role key which bypasses RLS:

1. First, get your Supabase service role key:
   - Go to your Supabase dashboard: https://app.supabase.com
   - Select your project
   - Go to "Project Settings" → "API"
   - Look for "service_role key" (Note: Keep this secret! It has admin privileges)

2. Update your backend .env file to include:
   SUPABASE_SERVICE_KEY=your_service_role_key

3. Update your backend/src/routes/auth.routes.js file to use the service role key for profile operations:

   Find this line at the top of the file:
   
   \`\`\`javascript
   // Create Supabase client for auth strategies
   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
   \`\`\`

   Add this line below it:
   
   \`\`\`javascript
   // Admin client with service role key to bypass RLS
   const adminSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
   \`\`\`

4. Change the profile insert operations to use adminSupabase instead of supabase:

   For example, when creating a profile in the signup route, change:
   
   \`\`\`javascript
   const { error: profileError } = await supabase
     .from('profiles')
     .insert({
       id: authData.user.id,
       username,
       full_name: fullName,
       created_at: new Date().toISOString()
     });
   \`\`\`

   To:
   
   \`\`\`javascript
   const { error: profileError } = await adminSupabase
     .from('profiles')
     .insert({
       id: authData.user.id,
       username,
       full_name: fullName,
       created_at: new Date().toISOString()
     });
   \`\`\`

5. Do the same for all other profile creation operations (Google OAuth, Apple OAuth)

6. Restart your backend server after making these changes

This approach allows your backend to bypass RLS policies when creating profiles
while still maintaining security for client-side operations.

===== ALTERNATIVE: FIX RLS POLICIES =====

Alternatively, you can modify your RLS policies in Supabase as described in the fix-rls.js script.
That approach might be preferable if you want to maintain RLS for all operations.
`);

// Potential code to automatically apply the fix if environment variables are available
// Uncomment and modify if needed
/*
const fs = require('fs');
const path = require('path');

try {
  const authRoutesPath = path.join(__dirname, 'backend', 'src', 'routes', 'auth.routes.js');
  
  if (fs.existsSync(authRoutesPath)) {
    let content = fs.readFileSync(authRoutesPath, 'utf8');
    
    // Add admin client
    content = content.replace(
      "const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);",
      "const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);\n\n// Admin client with service role key to bypass RLS\nconst adminSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);"
    );
    
    // Replace profile operations
    content = content.replace(
      /const \{ error: profileError \} = await supabase\s+\.from\('profiles'\)/g,
      "const { error: profileError } = await adminSupabase.from('profiles')"
    );
    
    fs.writeFileSync(authRoutesPath, content);
    console.log("✅ Successfully updated auth.routes.js to use service role key!");
  } else {
    console.log("❌ Could not find auth.routes.js in the expected location.");
  }
} catch (error) {
  console.error("Error updating code:", error);
}
*/ 