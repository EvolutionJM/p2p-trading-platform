const binanceService = require('../services/binanceService');
const logger = require('../utils/logger');

// @desc    Get Binance P2P orders
// @route   GET /api/binance/orders
// @access  Public
exports.getBinanceOrders = async (req, res) => {
  try {
    const { asset, fiat, tradeType, page, rows } = req.query;

    const orders = await binanceService.fetchP2POrders({
      asset,
      fiat,
      tradeType,
      page: parseInt(page) || 1,
      rows: parseInt(rows) || 20
    });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    logger.error('Get Binance orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Binance orders',
      error: error.message
    });
  }
};

// @desc    Get crypto prices from Binance
// @route   GET /api/binance/prices
// @access  Public
exports.getCryptoPrices = async (req, res) => {
  try {
    const { symbols } = req.query;
    const symbolArray = symbols ? symbols.split(',') : ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

    const prices = await binanceService.getCryptoPrices(symbolArray);

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

// @desc    Get available payment methods for a fiat currency
// @route   GET /api/binance/payment-methods
// @access  Public
exports.getPaymentMethods = async (req, res) => {
  try {
    const { fiat } = req.query;

    const paymentMethods = await binanceService.getPaymentMethods(fiat || 'USD');

    res.json({
      success: true,
      paymentMethods
    });
  } catch (error) {
    logger.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment methods',
      error: error.message
    });
  }
};
