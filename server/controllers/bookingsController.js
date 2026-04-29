const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Package = require('../models/Package');
const Stylist = require('../models/Stylist');
const User = require('../models/User');
const { sendBookingConfirmation } = require('../utils/emailService');
const { generateAvailableSlots, getDayOfWeek } = require('../utils/slotGenerator');

// POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const {
      serviceId, packageId, stylistId, date, timeSlot, notes,
      guestName, guestEmail, guestPhone,
    } = req.body;

    // Validate stylist exists and is available on that day
    const stylist = await Stylist.findById(stylistId);
    if (!stylist) return res.status(404).json({ success: false, message: 'Stylist not found.' });

    const day = getDayOfWeek(date);
    if (!stylist.availability[day]) {
      return res.status(400).json({ success: false, message: `Stylist is not available on ${day}.` });
    }

    // Check slot is not already taken (UTC-safe boundaries)
    const slotDate = new Date(date);
    const slotStart = new Date(Date.UTC(slotDate.getUTCFullYear(), slotDate.getUTCMonth(), slotDate.getUTCDate(), 0, 0, 0, 0));
    const slotEnd   = new Date(Date.UTC(slotDate.getUTCFullYear(), slotDate.getUTCMonth(), slotDate.getUTCDate(), 23, 59, 59, 999));
    const existing = await Booking.findOne({
      stylistId,
      date: { $gte: slotStart, $lte: slotEnd },
      timeSlot,
      status: { $ne: 'cancelled' },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked.' });
    }

    // Determine total amount
    let totalAmount = 0;
    let serviceName = '';
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (service) { totalAmount = service.price; serviceName = service.name; }
    } else if (packageId) {
      const pkg = await Package.findById(packageId);
      if (pkg) { totalAmount = pkg.discountedPrice; serviceName = pkg.title; }
    }

    const bookingData = {
      stylistId,
      date: new Date(date),
      timeSlot,
      totalAmount,
      notes,
    };

    if (serviceId) bookingData.serviceId = serviceId;
    if (packageId) bookingData.packageId = packageId;

    // Attach userId if logged in, else guest
    if (req.user) {
      bookingData.userId = req.user._id;
    } else {
      bookingData.userId = null;
      bookingData.guestName = guestName;
      bookingData.guestEmail = guestEmail;
      bookingData.guestPhone = guestPhone;
    }

    const booking = await Booking.create(bookingData);

    // Add to user's booking history
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $push: { bookingHistory: booking._id } });
    }

    // Send confirmation email (fire-and-forget — never block the booking response)
    const emailTo = req.user ? req.user.email : guestEmail;
    const name = req.user ? req.user.name : guestName;
    if (emailTo) {
      sendBookingConfirmation({ to: emailTo, name, booking, service: serviceName, stylist: stylist.name })
        .catch(err => console.error('📧 Email error (non-fatal):', err.message));
    }

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/availability
exports.getAvailability = async (req, res, next) => {
  try {
    const { date, stylistId } = req.query;
    if (!date || !stylistId) {
      return res.status(400).json({ success: false, message: 'date and stylistId are required.' });
    }

    const stylist = await Stylist.findById(stylistId);
    if (!stylist) return res.status(404).json({ success: false, message: 'Stylist not found.' });

    const day = getDayOfWeek(date);
    if (!stylist.availability[day]) {
      return res.status(200).json({ success: true, available: [], message: 'Stylist is off on this day.' });
    }

    // Build UTC-safe day boundaries from the date string
    const dayDate = new Date(date);
    const startOfDay = new Date(Date.UTC(
      dayDate.getUTCFullYear(), dayDate.getUTCMonth(), dayDate.getUTCDate(), 0, 0, 0, 0
    ));
    const endOfDay = new Date(Date.UTC(
      dayDate.getUTCFullYear(), dayDate.getUTCMonth(), dayDate.getUTCDate(), 23, 59, 59, 999
    ));

    const booked = await Booking.find({
      stylistId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' },
    }).select('timeSlot');

    const bookedSlots = booked.map((b) => b.timeSlot);
    const available = generateAvailableSlots(bookedSlots);

    res.status(200).json({ success: true, available, booked: bookedSlots });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/user/:userId
exports.getUserBookings = async (req, res, next) => {
  try {
    // Allow own bookings or admin
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('serviceId', 'name category price')
      .populate('packageId', 'title tier discountedPrice')
      .populate('stylistId', 'name role image')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/admin (admin only)
exports.getAdminBookings = async (req, res, next) => {
  try {
    const { status, date, stylistId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (stylistId) filter.stylistId = stylistId;
    if (date) {
      const d = new Date(date);
      filter.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone')
      .populate('serviceId', 'name category price')
      .populate('packageId', 'title tier discountedPrice')
      .populate('stylistId', 'name role')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ success: true, total, page: parseInt(page), data: bookings });
  } catch (err) {
    next(err);
  }
};

// PUT /api/bookings/:id/status (admin)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/stats (admin dashboard)
exports.getBookingStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayCount = await Booking.countDocuments({ date: { $gte: today, $lt: tomorrow } });
    const pending = await Booking.countDocuments({ status: 'pending' });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] }, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        todayCount,
        pending,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue,
      },
    });
  } catch (err) {
    next(err);
  }
};
