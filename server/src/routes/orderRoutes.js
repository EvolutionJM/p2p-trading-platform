const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, requireKYC, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, orderController.getOrders);
router.get('/:id', optionalAuth, orderController.getOrderById);

// Protected routes
router.post('/', protect, requireKYC, orderController.createOrder);
router.put('/:id', protect, orderController.updateOrder);
router.delete('/:id', protect, orderController.deleteOrder);
router.get('/user/my-orders', protect, orderController.getMyOrders);

module.exports = router;
