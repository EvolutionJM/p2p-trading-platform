const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/:id/profile', userController.getUserProfile);

// Protected routes
router.get('/me/stats', protect, userController.getMyStats);
router.post('/payment-methods', protect, userController.addPaymentMethod);
router.delete('/payment-methods/:id', protect, userController.removePaymentMethod);
router.post('/wallets', protect, userController.addWallet);
router.delete('/wallets/:id', protect, userController.removeWallet);

// Admin routes
router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.put('/:id/status', protect, authorize('admin'), userController.updateUserStatus);

module.exports = router;
