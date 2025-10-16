const Order = require('../models/Order');
const logger = require('../utils/logger');
const { emitNewOrder, emitOrderUpdate } = require('../services/socketService');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
exports.getOrders = async (req, res) => {
  try {
    const {
      type,
      cryptocurrency,
      fiatCurrency,
      minAmount,
      maxAmount,
      paymentMethod,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const query = { status: 'active' };

    if (type) query.type = type;
    if (cryptocurrency) query.cryptocurrency = cryptocurrency;
    if (fiatCurrency) query.fiatCurrency = fiatCurrency;
    if (paymentMethod) query.paymentMethods = paymentMethod;

    if (minAmount || maxAmount) {
      query.availableAmount = {};
      if (minAmount) query.availableAmount.$gte = parseFloat(minAmount);
      if (maxAmount) query.availableAmount.$lte = parseFloat(maxAmount);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('user', 'username avatar stats kycStatus')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username avatar stats kycStatus createdAt');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Increment views
    order.views += 1;
    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    logger.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/KYC
exports.createOrder = async (req, res) => {
  try {
    const {
      type,
      cryptocurrency,
      fiatCurrency,
      price,
      amount,
      minLimit,
      maxLimit,
      paymentMethods,
      paymentTimeLimit,
      terms,
      autoReply,
      isVerifiedOnly
    } = req.body;

    const order = await Order.create({
      user: req.user.id,
      type,
      cryptocurrency,
      fiatCurrency,
      price,
      amount,
      availableAmount: amount,
      minLimit,
      maxLimit,
      paymentMethods,
      paymentTimeLimit,
      terms,
      autoReply,
      isVerifiedOnly
    });

    await order.populate('user', 'username avatar stats kycStatus');

    // Emit new order via WebSocket
    emitNewOrder(order);

    logger.info(`New order created: ${order._id} by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
exports.updateOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Don't allow updating Bybit orders
    if (order.source === 'bybit') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update Bybit orders'
      });
    }

    const allowedUpdates = ['price', 'terms', 'autoReply', 'status', 'paymentTimeLimit'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    order = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'username avatar stats kycStatus');

    // Emit order update via WebSocket
    emitOrderUpdate(order);

    res.json({
      success: true,
      order
    });
  } catch (error) {
    logger.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order'
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this order'
      });
    }

    // Don't allow deleting Bybit orders
    if (order.source === 'bybit') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete Bybit orders'
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Emit order update via WebSocket
    emitOrderUpdate(order);

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    logger.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order'
    });
  }
};

// @desc    Get my orders
// @route   GET /api/orders/user/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders
    });
  } catch (error) {
    logger.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};
