const express = require('express');
const router = express.Router();
const { getBinanceOrders, getCryptoPrices, getPaymentMethods } = require('../controllers/binanceController');

// Public routes
router.get('/orders', getBinanceOrders);
router.get('/prices', getCryptoPrices);
router.get('/payment-methods', getPaymentMethods);

module.exports = router;
