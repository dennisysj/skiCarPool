const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client for auth strategies
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Admin client with service role key to bypass RLS
const adminSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);

// Configure Passport for Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth successful. Profile:', profile.displayName);
    
    // Check if user exists
    const { data: existingUser, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('google_id', profile.id)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error checking for existing user:', findError);
      return done(findError, null);
    }

    if (existingUser) {
      console.log('Existing user found:', existingUser.id);
      return done(null, existingUser);
    }

    console.log('No existing user found, creating new user');
    
    // Create new user if not found
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email: profile.emails[0].value,
      password: crypto.randomBytes(20).toString('hex'),
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return done(authError, null);
    }

    console.log('Auth user created:', user.id);

    // Create profile
    const { error: profileError } = await adminSupabase.from('profiles').insert({
        id: user.id,
        google_id: profile.id,
        full_name: profile.displayName,
        username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
        created_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return done(profileError, null);
    }

    console.log('Profile created successfully');
    return done(null, user);
  } catch (error) {
    console.error('Unexpected error in Google OAuth:', error);
    return done(error, null);
  }
}));

// Configure Passport for Apple OAuth
passport.use(new AppleStrategy({
  clientID: process.env.APPLE_CLIENT_ID,
  teamID: process.env.APPLE_TEAM_ID,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/apple/callback`,
  keyID: process.env.APPLE_KEY_ID,
  privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Apple profile handling is similar to Google
    // Implementation depends on what Apple returns in the profile
    // This is a simplified version
    const email = profile.email;
    
    // Check if user exists
    const { data: existingUser, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('apple_id', profile.id)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      return done(findError, null);
    }

    if (existingUser) {
      return done(null, existingUser);
    }

    // Create new user if not found
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email: email,
      password: crypto.randomBytes(20).toString('hex'),
    });

    if (authError) {
      return done(authError, null);
    }

    // Create profile
    const { error: profileError } = await adminSupabase.from('profiles').insert({
        id: user.id,
        apple_id: profile.id,
        full_name: profile.name || email.split('@')[0],
        username: (profile.name || email.split('@')[0]).replace(/\s+/g, '').toLowerCase(),
        created_at: new Date().toISOString()
      });

    if (profileError) {
      return done(profileError, null);
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Validation schemas
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  username: Joi.string().alphanum().min(3).max(30).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, fullName, username } = value;

    // Register user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create a profile entry
    if (authData.user) {
      const { error: profileError } = await adminSupabase.from('profiles').insert({
          id: authData.user.id,
          username,
          full_name: fullName,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        // If profile creation fails, log it but continue (user is still created)
        console.error('Error creating profile:', profileError);
        return res.status(500).json({ error: 'Error creating user profile' });
      }
    }

    return res.status(201).json({
      message: 'User registered successfully',
      user: authData.user
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Login with Supabase
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return res.status(401).json({ error: loginError.message });
    }

    return res.status(200).json({
      message: 'Login successful',
      session: data.session,
      user: data.user
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Sign out with Supabase
    const { error } = await supabase.auth.signOut({
      token
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Server error during logout' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Get user data from Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: error?.message || 'Invalid token' });
    }

    // Get the user's profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return res.status(500).json({ error: 'Error fetching user profile' });
    }

    return res.status(200).json({
      user: data.user,
      profile: profileData
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ error: 'Server error fetching user data' });
  }
});

// Google auth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
  }), 
  (req, res) => {
    console.log('Google authentication successful, redirecting to dashboard');
    
    // You can add user data to the session here if needed
    if (req.user) {
      req.session.userId = req.user.id;
      req.session.userEmail = req.user.email;
      req.session.isLoggedIn = true;
    }
    
    // Successful authentication, redirect to dashboard
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

// Apple auth routes
router.get('/apple', passport.authenticate('apple'));

router.get('/apple/callback', passport.authenticate('apple', {
  failureRedirect: `${process.env.FRONTEND_URL}/login`
}), (req, res) => {
  // Successful authentication
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});

// Create profile endpoint for frontend
router.post('/create-profile', async (req, res) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token and get user
    const { data: userData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !userData.user) {
      return res.status(401).json({ error: authError?.message || 'Invalid token' });
    }

    const { userId, email, fullName, username } = req.body;
    
    // Verify that the token's user matches the requested userId
    if (userData.user.id !== userId) {
      return res.status(403).json({ error: 'User ID mismatch' });
    }

    try {
      // First try using the adminSupabase client to bypass RLS
      const { error: profileError } = await adminSupabase.from('profiles').insert({
        id: userId,
        username: username || email.split('@')[0],
        full_name: fullName || '',
        created_at: new Date().toISOString()
      });

      if (profileError) {
        console.error('Error creating profile with adminSupabase:', profileError);
        
        // If that fails, try a raw SQL insert using PostgreSQL client
        const { data: pgResult, error: pgError } = await adminSupabase.rpc('create_profile', { 
          user_id: userId,
          user_username: username || email.split('@')[0],
          user_fullname: fullName || '',
          user_created_at: new Date().toISOString()
        });

        if (pgError) {
          console.error('Error creating profile with rpc:', pgError);
          
          // If the RPC doesn't exist, send instructions to create it
          console.log(`
            To fix the profile creation issue, please create this function in Supabase SQL Editor:
            
            CREATE OR REPLACE FUNCTION public.create_profile(
              user_id uuid,
              user_username text,
              user_fullname text,
              user_created_at timestamptz
            ) RETURNS boolean 
            LANGUAGE plpgsql SECURITY DEFINER
            AS $$
            BEGIN
              INSERT INTO public.profiles (id, username, full_name, created_at)
              VALUES (user_id, user_username, user_fullname, user_created_at);
              RETURN true;
            EXCEPTION
              WHEN others THEN
                RAISE NOTICE 'Error creating profile: %', SQLERRM;
                RETURN false;
            END;
            $$;
          `);
          
          return res.status(500).json({ error: 'Failed to create profile - database error' });
        }
      }
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return res.status(500).json({ error: 'Database operation failed' });
    }

    return res.status(201).json({ message: 'Profile created successfully' });
  } catch (error) {
    console.error('Create profile error:', error);
    return res.status(500).json({ error: 'Server error creating profile' });
  }
});

module.exports = router; 