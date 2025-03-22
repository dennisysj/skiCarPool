/**
 * Script to automatically update auth.routes.js to use service role key
 */
const fs = require('fs');
const path = require('path');

console.log('===== UPDATING AUTH ROUTES TO USE SERVICE ROLE KEY =====');

try {
  // Check for .env file to read or create
  const envPath = path.join(__dirname, 'backend', '.env');
  let envExists = fs.existsSync(envPath);
  
  if (!envExists) {
    console.log('No .env file found in backend directory.');
    console.log('You will need to create one with SUPABASE_SERVICE_KEY.');
  } else {
    console.log('Found .env file in backend directory.');
    
    // Read current .env
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if it already has service key
    if (!envContent.includes('SUPABASE_SERVICE_KEY')) {
      console.log('SUPABASE_SERVICE_KEY not found in .env file.');
      console.log('Please add it manually:');
      console.log('SUPABASE_SERVICE_KEY=your_service_role_key\n');
    } else {
      console.log('SUPABASE_SERVICE_KEY already exists in .env file.');
    }
  }
  
  // Update auth.routes.js
  const authRoutesPath = path.join(__dirname, 'backend', 'src', 'routes', 'auth.routes.js');
  
  if (!fs.existsSync(authRoutesPath)) {
    console.log('❌ Could not find auth.routes.js in the expected location.');
    console.log(`Expected path: ${authRoutesPath}`);
    return;
  }
  
  console.log('Found auth.routes.js, applying changes...');
  
  let content = fs.readFileSync(authRoutesPath, 'utf8');
  let modified = false;
  
  // Check if adminSupabase already exists
  if (content.includes('adminSupabase')) {
    console.log('adminSupabase client already exists in the file.');
  } else {
    // Add admin client
    const supabaseClientRegex = /const\s+supabase\s*=\s*createClient\s*\(\s*process\.env\.SUPABASE_URL\s*,\s*process\.env\.SUPABASE_KEY\s*\);/;
    
    if (supabaseClientRegex.test(content)) {
      content = content.replace(
        supabaseClientRegex,
        `const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);\n\n// Admin client with service role key to bypass RLS\nconst adminSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);`
      );
      modified = true;
      console.log('✅ Added adminSupabase client');
    } else {
      console.log('❌ Could not find the supabase client initialization.');
      console.log('You will need to add the adminSupabase client manually.');
    }
  }
  
  // Replace profile operations if adminSupabase exists in the content now
  if (content.includes('adminSupabase')) {
    // Google OAuth profile creation
    let googleProfileRegex = /(const\s*{\s*error\s*:\s*profileError\s*}\s*=\s*await\s*supabase\s*\.\s*from\s*\(\s*'profiles'\s*\)\s*\.\s*insert\s*\(\s*{\s*id\s*:\s*user\.id,\s*google_id\s*:)/;
    if (googleProfileRegex.test(content)) {
      content = content.replace(googleProfileRegex, 'const { error: profileError } = await adminSupabase.from(\'profiles\').insert({\n        id: user.id,\n        google_id:');
      modified = true;
      console.log('✅ Updated Google OAuth profile creation');
    }
    
    // Apple OAuth profile creation
    let appleProfileRegex = /(const\s*{\s*error\s*:\s*profileError\s*}\s*=\s*await\s*supabase\s*\.\s*from\s*\(\s*'profiles'\s*\)\s*\.\s*insert\s*\(\s*{\s*id\s*:\s*user\.id,\s*apple_id\s*:)/;
    if (appleProfileRegex.test(content)) {
      content = content.replace(appleProfileRegex, 'const { error: profileError } = await adminSupabase.from(\'profiles\').insert({\n        id: user.id,\n        apple_id:');
      modified = true;
      console.log('✅ Updated Apple OAuth profile creation');
    }
    
    // Signup route profile creation
    let signupProfileRegex = /(const\s*{\s*error\s*:\s*profileError\s*}\s*=\s*await\s*supabase\s*\.\s*from\s*\(\s*'profiles'\s*\)\s*\.\s*insert\s*\(\s*{\s*id\s*:\s*authData\.user\.id,)/;
    if (signupProfileRegex.test(content)) {
      content = content.replace(signupProfileRegex, 'const { error: profileError } = await adminSupabase.from(\'profiles\').insert({\n          id: authData.user.id,');
      modified = true;
      console.log('✅ Updated signup route profile creation');
    }
    
    if (modified) {
      // Create backup
      fs.writeFileSync(`${authRoutesPath}.backup`, fs.readFileSync(authRoutesPath));
      console.log(`✅ Created backup at ${authRoutesPath}.backup`);
      
      // Write changes
      fs.writeFileSync(authRoutesPath, content);
      console.log('✅ Successfully updated auth.routes.js to use service role key!');
      console.log('\nNEXT STEPS:');
      console.log('1. Add your Supabase service role key to backend/.env:');
      console.log('   SUPABASE_SERVICE_KEY=your_service_role_key');
      console.log('2. Restart your backend server');
      console.log('3. Try signing up again');
    } else {
      console.log('⚠️ No profile operations were updated. The file structure might be different than expected.');
      console.log('You may need to update the profile insert operations manually.');
    }
  }
} catch (error) {
  console.error('❌ Error updating auth.routes.js:', error);
} 