const express = require('express');
const router = express.Router();
const bybitController = require('../controllers/bybitController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/orders', bybitController.getBybitOrders);
router.get('/prices', bybitController.getCryptoPrices);
router.get('/market-depth/:symbol', bybitController.getMarketDepth);

// Admin routes
router.post('/sync', protect, authorize('admin'), bybitController.syncOrders);

module.exports = router;
