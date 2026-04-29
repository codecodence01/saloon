const Testimonial = require('../models/Testimonial');

// GET /api/testimonials (approved only, public)
exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (err) {
    next(err);
  }
};

// GET /api/testimonials/admin (all, admin only)
exports.getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (err) {
    next(err);
  }
};

// POST /api/testimonials (submit review — pending approval)
exports.createTestimonial = async (req, res, next) => {
  try {
    const { rating, comment, serviceId, serviceName, guestName } = req.body;

    const testimonialData = { rating, comment, serviceName, isApproved: false };
    if (serviceId) testimonialData.serviceId = serviceId;

    if (req.user) {
      testimonialData.userId = req.user._id;
    } else {
      testimonialData.guestName = guestName;
    }

    const testimonial = await Testimonial.create(testimonialData);
    res.status(201).json({ success: true, data: testimonial, message: 'Review submitted for approval.' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/testimonials/:id/approve (admin)
exports.approveTestimonial = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.status(200).json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/testimonials/:id (admin)
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.status(200).json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    next(err);
  }
};
