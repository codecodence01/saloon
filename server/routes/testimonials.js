const express = require('express');
const router = express.Router();
const {
  getTestimonials, getAdminTestimonials, createTestimonial,
  approveTestimonial, deleteTestimonial,
} = require('../controllers/testimonialsController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', getTestimonials);
router.get('/admin', protect, restrictTo('admin'), getAdminTestimonials);
router.post('/', createTestimonial); // public — guest can submit
router.put('/:id/approve', protect, restrictTo('admin'), approveTestimonial);
router.delete('/:id', protect, restrictTo('admin'), deleteTestimonial);

module.exports = router;
