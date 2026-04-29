const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, adminLogin, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

router.post('/register', registerValidation, register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
