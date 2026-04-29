const express = require('express');
const router = express.Router();
const {
  getPackages, getPackage, createPackage, updatePackage, deletePackage,
} = require('../controllers/packagesController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', getPackages);
router.get('/:id', getPackage);
router.post('/', protect, restrictTo('admin'), createPackage);
router.put('/:id', protect, restrictTo('admin'), updatePackage);
router.delete('/:id', protect, restrictTo('admin'), deletePackage);

module.exports = router;
