const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const rideRoutes = require('./ride.routes');
const requestRoutes = require('./request.routes');
const uploadRoutes = require('./upload.routes');

// Use routes
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/rides', rideRoutes);
router.use('/requests', requestRoutes);
router.use('/uploads', uploadRoutes);

module.exports = router;
