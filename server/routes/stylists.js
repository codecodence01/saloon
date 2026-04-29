const express = require('express');
const router = express.Router();
const {
  getStylists, getStylist, createStylist, updateStylist, deleteStylist,
} = require('../controllers/stylistsController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getStylists);
router.get('/:id', getStylist);
router.post('/', protect, restrictTo('admin'), upload.single('image'), createStylist);
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), updateStylist);
router.delete('/:id', protect, restrictTo('admin'), deleteStylist);

module.exports = router;
