const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authMiddleware = require('../middleware/auth');

// Validation schema for creating a ride
const createRideSchema = Joi.object({
  departure_location: Joi.string().required(),
  destination: Joi.string().required(),
  departure_time: Joi.date().iso().required(),
  available_seats: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().allow('', null)
});

// Validation schema for updating a ride
const updateRideSchema = Joi.object({
  departure_location: Joi.string(),
  destination: Joi.string(),
  departure_time: Joi.date().iso(),
  available_seats: Joi.number().integer().min(1),
  price: Joi.number().min(0),
  description: Joi.string().allow('', null)
});

// Get all rides
router.get('/', async (req, res) => {
  try {
    let query = req.supabase
      .from('rides')
      .select(`
        *,
        profiles:driver_id (username, full_name, avatar_url)
      `)
      .order('departure_time', { ascending: true });

    // Apply filters if provided
    const { destination, departure_location, from_date, to_date, min_seats } = req.query;

    if (destination) {
      query = query.ilike('destination', `%${destination}%`);
    }

    if (departure_location) {
      query = query.ilike('departure_location', `%${departure_location}%`);
    }

    if (from_date) {
      query = query.gte('departure_time', from_date);
    }

    if (to_date) {
      query = query.lte('departure_time', to_date);
    }

    if (min_seats) {
      query = query.gte('available_seats', parseInt(min_seats));
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Get rides error:', error);
    return res.status(500).json({ error: 'Server error fetching rides' });
  }
});

// Get a specific ride by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await req.supabase
      .from('rides')
      .select(`
        *,
        profiles:driver_id (username, full_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Get ride by ID error:', error);
    return res.status(500).json({ error: 'Server error fetching ride' });
  }
});

// Create a new ride
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Validate request body
    const { error: validationError, value } = createRideSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    // Add driver_id from authenticated user
    const newRide = {
      ...value,
      driver_id: req.user.id,
      created_at: new Date().toISOString()
    };

    // Create ride in Supabase
    const { data, error } = await req.supabase
      .from('rides')
      .insert(newRide)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Ride created successfully',
      ride: data
    });
  } catch (error) {
    console.error('Create ride error:', error);
    return res.status(500).json({ error: 'Server error creating ride' });
  }
});

// Update a ride
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error: validationError, value } = updateRideSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    // Check if the ride exists and user is the driver
    const { data: rideData, error: rideError } = await req.supabase
      .from('rides')
      .select('driver_id')
      .eq('id', id)
      .single();

    if (rideError) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (rideData.driver_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update rides you created' });
    }

    // Update ride in Supabase
    const { data, error } = await req.supabase
      .from('rides')
      .update(value)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Ride updated successfully',
      ride: data
    });
  } catch (error) {
    console.error('Update ride error:', error);
    return res.status(500).json({ error: 'Server error updating ride' });
  }
});

// Delete a ride
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ride exists and user is the driver
    const { data: rideData, error: rideError } = await req.supabase
      .from('rides')
      .select('driver_id')
      .eq('id', id)
      .single();

    if (rideError) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (rideData.driver_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete rides you created' });
    }

    // Delete ride in Supabase
    const { error } = await req.supabase
      .from('rides')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Ride deleted successfully'
    });
  } catch (error) {
    console.error('Delete ride error:', error);
    return res.status(500).json({ error: 'Server error deleting ride' });
  }
});

// Get rides offered by the current user
router.get('/driver/me', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('rides')
      .select('*')
      .eq('driver_id', req.user.id)
      .order('departure_time', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Get user rides error:', error);
    return res.status(500).json({ error: 'Server error fetching rides' });
  }
});

module.exports = router; 