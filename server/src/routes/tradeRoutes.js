const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const { protect, requireKYC } = require('../middleware/auth');

// All trade routes require authentication and KYC
router.use(protect, requireKYC);

router.post('/', tradeController.createTrade);
router.get('/', tradeController.getMyTrades);
router.get('/:id', tradeController.getTradeById);
router.put('/:id/confirm-payment', tradeController.confirmPayment);
router.put('/:id/release', tradeController.releaseCrypto);
router.put('/:id/cancel', tradeController.cancelTrade);
router.put('/:id/dispute', tradeController.initiateDispute);
router.post('/:id/chat', tradeController.sendMessage);
router.post('/:id/rating', tradeController.addRating);

module.exports = router;
