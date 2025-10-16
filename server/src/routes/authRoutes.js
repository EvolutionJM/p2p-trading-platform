const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rate limiters
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many accounts created from this IP, please try again after an hour'
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerLimiter, registerValidation, authController.register);
router.post('/login', loginLimiter, loginValidation, authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);
router.post('/verify-email', protect, authController.verifyEmail);
router.post('/resend-pin', protect, authController.resendPIN);

// 2FA routes
router.post('/2fa/setup', protect, authController.setup2FA);
router.post('/2fa/verify', protect, authController.verify2FA);
router.post('/2fa/disable', protect, authController.disable2FA);
router.post('/2fa/login', authController.login2FA);

// Get current user
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
