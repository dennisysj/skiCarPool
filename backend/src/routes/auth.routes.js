const express = require('express');
const router = express.Router();
const Joi = require('joi');

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
    const { data: authData, error: authError } = await req.supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create a profile entry
    if (authData.user) {
      const { error: profileError } = await req.supabase
        .from('profiles')
        .insert({
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
    const { data, error: loginError } = await req.supabase.auth.signInWithPassword({
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
    const { error } = await req.supabase.auth.signOut({
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
    const { data, error } = await req.supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: error?.message || 'Invalid token' });
    }

    // Get the user's profile
    const { data: profileData, error: profileError } = await req.supabase
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

module.exports = router; 