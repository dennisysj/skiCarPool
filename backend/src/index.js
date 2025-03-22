require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const routes = require('./routes');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Make supabase client available in req object
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session
app.use(session({
  secret: process.env.SESSION_SECRET || 'ski-carpool-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport with session
app.use(passport.initialize());
app.use(passport.session());

// Configure passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return done(error, null);
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
});

// Make crypto available
global.crypto = crypto;

// Routes
app.use('/api', routes);

// Health check route
app.use('/', (req, res) => {
  res.json({ message: 'Ski Carpool API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Google OAuth callback URL: ${process.env.BACKEND_URL}/api/auth/google/callback`);
});
