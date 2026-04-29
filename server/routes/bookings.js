const express = require('express');
const router = express.Router();
const {
  createBooking, getAvailability, getUserBookings,
  getAdminBookings, updateBookingStatus, getBookingStats,
} = require('../controllers/bookingsController');
const { protect, restrictTo } = require('../middleware/auth');

// Public (optional auth for guest bookings)
router.post('/', (req, res, next) => {
  // try to authenticate but don't require it (guest bookings)
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      User.findById(decoded.id).then((user) => {
        if (user) req.user = user;
        next();
      });
    } catch {
      next();
    }
  } else {
    next();
  }
}, createBooking);

router.get('/availability', getAvailability);
router.get('/stats', protect, restrictTo('admin'), getBookingStats);
router.get('/admin', protect, restrictTo('admin'), getAdminBookings);
router.get('/user/:userId', protect, getUserBookings);
router.put('/:id/status', protect, restrictTo('admin'), updateBookingStatus);

module.exports = router;
