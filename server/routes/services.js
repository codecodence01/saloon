const express = require('express');
const router = express.Router();
const {
  getServices, getService, createService, updateService, deleteService,
} = require('../controllers/servicesController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, restrictTo('admin'), upload.single('image'), createService);
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), updateService);
router.delete('/:id', protect, restrictTo('admin'), deleteService);

module.exports = router;
