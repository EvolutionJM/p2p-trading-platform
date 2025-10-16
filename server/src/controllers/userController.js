const User = require('../models/User');
const Trade = require('../models/Trade');
const logger = require('../utils/logger');

// @desc    Get user profile
// @route   GET /api/users/:id/profile
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-email -phoneNumber');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent trades
    const recentTrades = await Trade.find({
      $or: [{ buyer: user._id }, { seller: user._id }],
      status: 'completed'
    })
      .sort('-completedAt')
      .limit(5)
      .select('cryptocurrency amount completedAt rating');

    res.json({
      success: true,
      user,
      recentTrades
    });
  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
};

// @desc    Get my stats
// @route   GET /api/users/me/stats
// @access  Private
exports.getMyStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const stats = {
      ...user.stats.toObject(),
      completionRate: user.stats.totalTrades > 0 
        ? (user.stats.completedTrades / user.stats.totalTrades * 100).toFixed(2)
        : 0
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    logger.error('Get my stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
};

// @desc    Add payment method
// @route   POST /api/users/payment-methods
// @access  Private
exports.addPaymentMethod = async (req, res) => {
  try {
    const { type, details } = req.body;

    const user = await User.findById(req.user.id);

    user.paymentMethods.push({
      type,
      details,
      isVerified: false
    });

    await user.save();

    res.json({
      success: true,
      paymentMethods: user.paymentMethods
    });
  } catch (error) {
    logger.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding payment method'
    });
  }
};

// @desc    Remove payment method
// @route   DELETE /api/users/payment-methods/:id
// @access  Private
exports.removePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.paymentMethods = user.paymentMethods.filter(
      pm => pm._id.toString() !== req.params.id
    );

    await user.save();

    res.json({
      success: true,
      paymentMethods: user.paymentMethods
    });
  } catch (error) {
    logger.error('Remove payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing payment method'
    });
  }
};

// @desc    Add wallet
// @route   POST /api/users/wallets
// @access  Private
exports.addWallet = async (req, res) => {
  try {
    const { currency, address, network } = req.body;

    const user = await User.findById(req.user.id);

    user.wallets.push({
      currency,
      address,
      network,
      isVerified: false
    });

    await user.save();

    res.json({
      success: true,
      wallets: user.wallets
    });
  } catch (error) {
    logger.error('Add wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding wallet'
    });
  }
};

// @desc    Remove wallet
// @route   DELETE /api/users/wallets/:id
// @access  Private
exports.removeWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.wallets = user.wallets.filter(
      w => w._id.toString() !== req.params.id
    );

    await user.save();

    res.json({
      success: true,
      wallets: user.wallets
    });
  } catch (error) {
    logger.error('Remove wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing wallet'
    });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, kycStatus } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    if (kycStatus) {
      query.kycStatus = kycStatus;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      users
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// @desc    Update user status (admin)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info(`User ${user.username} status updated to ${isActive ? 'active' : 'inactive'}`);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    logger.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status'
    });
  }
};
