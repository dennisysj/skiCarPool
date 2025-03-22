const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authMiddleware = require('../middleware/auth');

// Validation schema for profile update
const profileUpdateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  full_name: Joi.string(),
  avatar_url: Joi.string().uri().allow(null, '')
});

// Get current user's profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// Update current user's profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    // Validate request body
    const { error: validationError, value } = profileUpdateSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    // Update profile in Supabase
    const { data, error } = await req.supabase
      .from('profiles')
      .update(value)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: data
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Get profile by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await req.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Remove sensitive information if needed
    const publicProfile = {
      id: data.id,
      username: data.username,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      created_at: data.created_at
    };

    return res.status(200).json(publicProfile);
  } catch (error) {
    console.error('Get profile by ID error:', error);
    return res.status(500).json({ error: 'Server error fetching profile' });
  }
});

module.exports = router; 