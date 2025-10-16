const bybitService = require('../services/bybitService');
const Order = require('../models/Order');
const logger = require('../utils/logger');

// @desc    Get Bybit P2P orders
// @route   GET /api/bybit/orders
// @access  Public
exports.getBybitOrders = async (req, res) => {
  try {
    const { tokenId, currencyId, side, size, page } = req.query;

    const orders = await bybitService.fetchP2POrders({
      tokenId,
      currencyId,
      side,
      size: parseInt(size) || 50,
      page: parseInt(page) || 1
    });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    logger.error('Get Bybit orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Bybit orders',
      error: error.message
    });
  }
};

// @desc    Get crypto prices
// @route   GET /api/bybit/prices
// @access  Public
exports.getCryptoPrices = async (req, res) => {
  try {
    const { symbols } = req.query;
    const symbolArray = symbols ? symbols.split(',') : ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

    const prices = await bybitService.getCryptoPrices(symbolArray);

    res.json({
      success: true,
      prices
    });
  } catch (error) {
    logger.error('Get crypto prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching crypto prices',
      error: error.message
    });
  }
};

// @desc    Get market depth
// @route   GET /api/bybit/market-depth/:symbol
// @access  Public
exports.getMarketDepth = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { limit } = req.query;

    const depth = await bybitService.getMarketDepth(symbol, parseInt(limit) || 25);

    res.json({
      success: true,
      depth
    });
  } catch (error) {
    logger.error('Get market depth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching market depth',
      error: error.message
    });
  }
};

// @desc    Sync Bybit orders to database
// @route   POST /api/bybit/sync
// @access  Private/Admin
exports.syncOrders = async (req, res) => {
  try {
    const result = await bybitService.syncBybitOrders(Order);

    res.json({
      success: true,
      message: 'Bybit orders synced successfully',
      ...result
    });
  } catch (error) {
    logger.error('Sync Bybit orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing Bybit orders',
      error: error.message
    });
  }
};
