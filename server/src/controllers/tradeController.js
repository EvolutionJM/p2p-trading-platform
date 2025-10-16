const Trade = require('../models/Trade');
const Order = require('../models/Order');
const User = require('../models/User');
const logger = require('../utils/logger');
const { emitTradeUpdate, sendNotification } = require('../services/socketService');

// @desc    Create new trade
// @route   POST /api/trades
// @access  Private/KYC
exports.createTrade = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    const order = await Order.findById(orderId).populate('user');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Order is not active'
      });
    }

    // Can't trade with yourself
    if (order.user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot trade with yourself'
      });
    }

    // Check if order can fulfill the trade
    if (!order.canFulfill(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot fulfill this trade amount'
      });
    }

    // Check payment method
    if (!order.paymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Payment method not supported by this order'
      });
    }

    const totalValue = amount * order.price;
    const expiresAt = new Date(Date.now() + order.paymentTimeLimit * 60 * 1000);

    const trade = await Trade.create({
      order: orderId,
      buyer: order.type === 'sell' ? req.user.id : order.user._id,
      seller: order.type === 'sell' ? order.user._id : req.user.id,
      cryptocurrency: order.cryptocurrency,
      fiatCurrency: order.fiatCurrency,
      amount,
      price: order.price,
      totalValue,
      paymentMethod,
      status: 'payment_pending',
      expiresAt
    });

    // Update order available amount
    await order.updateAvailableAmount(amount);

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, { $inc: { 'stats.totalTrades': 1 } });
    await User.findByIdAndUpdate(order.user._id, { $inc: { 'stats.totalTrades': 1 } });

    await trade.populate(['buyer', 'seller', 'order']);

    // Send notifications
    sendNotification(order.user._id, {
      type: 'new_trade',
      tradeId: trade._id,
      message: 'New trade initiated'
    });

    emitTradeUpdate(trade);

    logger.info(`Trade created: ${trade._id}`);

    res.status(201).json({
      success: true,
      trade
    });
  } catch (error) {
    logger.error('Create trade error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating trade'
    });
  }
};

// @desc    Get my trades
// @route   GET /api/trades
// @access  Private
exports.getMyTrades = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {
      $or: [{ buyer: req.user.id }, { seller: req.user.id }]
    };

    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const trades = await Trade.find(query)
      .populate('buyer', 'username avatar stats')
      .populate('seller', 'username avatar stats')
      .populate('order', 'cryptocurrency fiatCurrency')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Trade.countDocuments(query);

    res.json({
      success: true,
      count: trades.length,
      total,
      trades
    });
  } catch (error) {
    logger.error('Get my trades error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trades'
    });
  }
};

// @desc    Get trade by ID
// @route   GET /api/trades/:id
// @access  Private
exports.getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id)
      .populate('buyer', 'username avatar stats paymentMethods')
      .populate('seller', 'username avatar stats paymentMethods')
      .populate('order');

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    // Check if user is part of the trade
    if (
      trade.buyer._id.toString() !== req.user.id &&
      trade.seller._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this trade'
      });
    }

    res.json({
      success: true,
      trade
    });
  } catch (error) {
    logger.error('Get trade by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trade'
    });
  }
};

// @desc    Confirm payment
// @route   PUT /api/trades/:id/confirm-payment
// @access  Private
exports.confirmPayment = async (req, res) => {
  try {
    const { proof } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    // Only buyer can confirm payment
    if (trade.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only buyer can confirm payment'
      });
    }

    if (trade.status !== 'payment_pending') {
      return res.status(400).json({
        success: false,
        message: 'Invalid trade status'
      });
    }

    await trade.confirmPayment(proof);
    await trade.populate(['buyer', 'seller']);

    sendNotification(trade.seller, {
      type: 'payment_confirmed',
      tradeId: trade._id,
      message: 'Buyer confirmed payment'
    });

    emitTradeUpdate(trade);

    res.json({
      success: true,
      trade
    });
  } catch (error) {
    logger.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment'
    });
  }
};

// @desc    Release crypto
// @route   PUT /api/trades/:id/release
// @access  Private
exports.releaseCrypto = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    // Only seller can release crypto
    if (trade.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only seller can release crypto'
      });
    }

    if (trade.status !== 'payment_confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Payment must be confirmed first'
      });
    }

    await trade.complete();
    await trade.populate(['buyer', 'seller']);

    // Update stats
    await User.findByIdAndUpdate(trade.buyer, { $inc: { 'stats.completedTrades': 1 } });
    await User.findByIdAndUpdate(trade.seller, { $inc: { 'stats.completedTrades': 1 } });

    sendNotification(trade.buyer, {
      type: 'trade_completed',
      tradeId: trade._id,
      message: 'Trade completed successfully'
    });

    emitTradeUpdate(trade);

    logger.info(`Trade completed: ${trade._id}`);

    res.json({
      success: true,
      trade
    });
  } catch (error) {
    logger.error('Release crypto error:', error);
    res.status(500).json({
      success: false,
      message: 'Error releasing crypto'
    });
  }
};

// @desc    Cancel trade
// @route   PUT /api/trades/:id/cancel
// @access  Private
exports.cancelTrade = async (req, res) => {
  try {
    const { reason } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    // Check if user is part of the trade
    const isBuyer = trade.buyer.toString() === req.user.id;
    const isSeller = trade.seller.toString() === req.user.id;

    if (!isBuyer && !isSeller && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this trade'
      });
    }

    if (['completed', 'cancelled'].includes(trade.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this trade'
      });
    }

    await trade.cancel(req.user.id, reason);

    // Return amount to order
    const order = await Order.findById(trade.order);
    if (order) {
      order.availableAmount += trade.amount;
      await order.save();
    }

    // Update stats
    await User.findByIdAndUpdate(trade.buyer, { $inc: { 'stats.cancelledTrades': 1 } });
    await User.findByIdAndUpdate(trade.seller, { $inc: { 'stats.cancelledTrades': 1 } });

    const otherUserId = isBuyer ? trade.seller : trade.buyer;
    sendNotification(otherUserId, {
      type: 'trade_cancelled',
      tradeId: trade._id,
      message: 'Trade has been cancelled'
    });

    emitTradeUpdate(trade);

    res.json({
      success: true,
      trade
    });
  } catch (error) {
    logger.error('Cancel trade error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling trade'
    });
  }
};

// @desc    Initiate dispute
// @route   PUT /api/trades/:id/dispute
// @access  Private
exports.initiateDispute = async (req, res) => {
  try {
    const { reason, evidence } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    const isBuyer = trade.buyer.toString() === req.user.id;
    const isSeller = trade.seller.toString() === req.user.id;

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await trade.initiateDispute(req.user.id, reason, evidence);

    const otherUserId = isBuyer ? trade.seller : trade.buyer;
    sendNotification(otherUserId, {
      type: 'trade_disputed',
      tradeId: trade._id,
      message: 'Trade has been disputed'
    });

    emitTradeUpdate(trade);

    logger.info(`Dispute initiated for trade: ${trade._id}`);

    res.json({
      success: true,
      trade
    });
  } catch (error) {
    logger.error('Initiate dispute error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating dispute'
    });
  }
};

// @desc    Send chat message
// @route   POST /api/trades/:id/chat
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    const isBuyer = trade.buyer.toString() === req.user.id;
    const isSeller = trade.seller.toString() === req.user.id;

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await trade.addMessage(req.user.id, message);

    res.json({
      success: true,
      message: 'Message sent'
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// @desc    Add rating
// @route   POST /api/trades/:id/rating
// @access  Private
exports.addRating = async (req, res) => {
  try {
    const { score, comment } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    if (trade.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed trades'
      });
    }

    const isBuyer = trade.buyer.toString() === req.user.id;
    const isSeller = trade.seller.toString() === req.user.id;

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await trade.addRating(req.user.id, score, comment);

    // Update user rating
    const otherUserId = isBuyer ? trade.seller : trade.buyer;
    const user = await User.findById(otherUserId);
    const newReviewCount = user.stats.reviewCount + 1;
    const newRating = ((user.stats.rating * user.stats.reviewCount) + score) / newReviewCount;
    
    user.stats.rating = newRating;
    user.stats.reviewCount = newReviewCount;
    await user.save();

    res.json({
      success: true,
      message: 'Rating added successfully'
    });
  } catch (error) {
    logger.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding rating'
    });
  }
};
