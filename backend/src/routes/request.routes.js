const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authMiddleware = require('../middleware/auth');

// Validation schema for creating a ride request
const createRequestSchema = Joi.object({
  ride_id: Joi.string().required(),
  message: Joi.string().allow('', null)
});

// Validation schema for updating a ride request
const updateRequestSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected', 'cancelled').required()
});

// Get all ride requests for a ride (driver only)
router.get('/ride/:rideId', authMiddleware, async (req, res) => {
  try {
    const { rideId } = req.params;

    // Check if the user is the driver of the ride
    const { data: rideData, error: rideError } = await req.supabase
      .from('rides')
      .select('driver_id')
      .eq('id', rideId)
      .single();

    if (rideError) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (rideData.driver_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only view requests for rides you created' });
    }

    // Get all requests for this ride
    const { data, error } = await req.supabase
      .from('ride_requests')
      .select(`
        *,
        profiles:passenger_id (username, full_name, avatar_url)
      `)
      .eq('ride_id', rideId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Get ride requests error:', error);
    return res.status(500).json({ error: 'Server error fetching ride requests' });
  }
});

// Get all ride requests made by current user (passenger)
router.get('/passenger/me', authMiddleware, async (req, res) => {
  try {
    // Get all requests made by this user
    const { data, error } = await req.supabase
      .from('ride_requests')
      .select(`
        *,
        rides (
          id,
          departure_location,
          destination,
          departure_time,
          price,
          driver_id,
          profiles:driver_id (username, full_name, avatar_url)
        )
      `)
      .eq('passenger_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Get passenger requests error:', error);
    return res.status(500).json({ error: 'Server error fetching passenger requests' });
  }
});

// Create a new ride request
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Validate request body
    const { error: validationError, value } = createRequestSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { ride_id, message } = value;

    // Check if the ride exists
    const { data: rideData, error: rideError } = await req.supabase
      .from('rides')
      .select('driver_id, available_seats')
      .eq('id', ride_id)
      .single();

    if (rideError) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check if user is not the driver
    if (rideData.driver_id === req.user.id) {
      return res.status(400).json({ error: 'You cannot request to join your own ride' });
    }

    // Check if available seats > 0
    if (rideData.available_seats < 1) {
      return res.status(400).json({ error: 'No available seats on this ride' });
    }

    // Check if user already has a request for this ride
    const { data: existingRequest, error: existingError } = await req.supabase
      .from('ride_requests')
      .select('id, status')
      .eq('ride_id', ride_id)
      .eq('passenger_id', req.user.id)
      .maybeSingle();

    if (existingRequest && (existingRequest.status === 'pending' || existingRequest.status === 'accepted')) {
      return res.status(400).json({ 
        error: `You already have a ${existingRequest.status} request for this ride` 
      });
    }

    // Create new request in Supabase
    const newRequest = {
      ride_id,
      passenger_id: req.user.id,
      status: 'pending',
      message: message || '',
      created_at: new Date().toISOString()
    };

    const { data, error } = await req.supabase
      .from('ride_requests')
      .insert(newRequest)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Ride request sent successfully',
      request: data
    });
  } catch (error) {
    console.error('Create request error:', error);
    return res.status(500).json({ error: 'Server error creating request' });
  }
});

// Update a ride request status (driver or passenger can update)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error: validationError, value } = updateRequestSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    // Get the request to find out ride_id and passenger_id
    const { data: requestData, error: requestError } = await req.supabase
      .from('ride_requests')
      .select(`
        ride_id,
        passenger_id,
        status,
        rides!inner (
          driver_id,
          available_seats
        )
      `)
      .eq('id', id)
      .single();

    if (requestError) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const isDriver = requestData.rides.driver_id === req.user.id;
    const isPassenger = requestData.passenger_id === req.user.id;
    const { status } = value;

    // Validate who can perform which action
    if (!isDriver && !isPassenger) {
      return res.status(403).json({ error: 'You do not have permission to update this request' });
    }

    // Passengers can only cancel their own requests
    if (isPassenger && status !== 'cancelled') {
      return res.status(403).json({ error: 'Passengers can only cancel their requests' });
    }

    // Drivers can accept or reject
    if (isDriver && !['accepted', 'rejected'].includes(status)) {
      return res.status(403).json({ error: 'Drivers can only accept or reject requests' });
    }

    // If already in the requested state
    if (requestData.status === status) {
      return res.status(400).json({ error: `Request is already ${status}` });
    }

    // Check if there are enough seats when accepting
    if (status === 'accepted') {
      if (requestData.rides.available_seats < 1) {
        return res.status(400).json({ error: 'No available seats left on this ride' });
      }

      // Decrease available seats
      const { error: updateRideError } = await req.supabase
        .from('rides')
        .update({ available_seats: requestData.rides.available_seats - 1 })
        .eq('id', requestData.ride_id);

      if (updateRideError) {
        return res.status(400).json({ error: 'Error updating ride seats' });
      }
    }

    // If cancelling a previously accepted request, increase available seats
    if (status === 'cancelled' && requestData.status === 'accepted') {
      const { error: updateRideError } = await req.supabase
        .from('rides')
        .update({ available_seats: requestData.rides.available_seats + 1 })
        .eq('id', requestData.ride_id);

      if (updateRideError) {
        return res.status(400).json({ error: 'Error updating ride seats' });
      }
    }

    // Update the request status
    const { data, error } = await req.supabase
      .from('ride_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: `Request ${status} successfully`,
      request: data
    });
  } catch (error) {
    console.error('Update request error:', error);
    return res.status(500).json({ error: 'Server error updating request' });
  }
});

module.exports = router; 