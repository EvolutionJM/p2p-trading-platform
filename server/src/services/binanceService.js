const axios = require('axios');
const logger = require('../utils/logger');

class BinanceService {
  constructor() {
    this.baseURL = 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search';
  }

  /**
   * Fetch P2P orders from Binance (Public API - no auth needed)
   */
  async fetchP2POrders(params = {}) {
    try {
      const {
        asset = 'USDT',
        fiat = 'USD',
        tradeType = 'BUY', // BUY or SELL
        paymentMethod = '',
        page = 1,
        rows = 20
      } = params;

      logger.info(`Fetching Binance P2P orders: ${asset}/${fiat}, type: ${tradeType}, payment: ${paymentMethod || 'all'}`);

      const requestData = {
        page,
        rows,
        payTypes: paymentMethod ? [paymentMethod] : [], // Filter by payment method if provided
        asset,
        tradeType,
        fiat,
        publisherType: null,
        merchantCheck: false
      };

      const response = await axios.post(this.baseURL, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data && response.data.data) {
        const orders = response.data.data;
        logger.info(`Successfully fetched ${orders.length} orders from Binance`);
        return this.transformBinanceOrders(orders, tradeType);
      }

      logger.warn('Binance API returned no data');
      return [];
    } catch (error) {
      logger.error('Error fetching Binance P2P orders:', error.message);
      return [];
    }
  }

  /**
   * Transform Binance orders to our format
   */
  transformBinanceOrders(binanceOrders, tradeType) {
    return binanceOrders.map(order => {
      const adv = order.adv;
      const advertiser = order.advertiser;

      // Parse completion rate - it might be 0-1 (0.98) or 0-100 (98)
      let completionRate = parseFloat(advertiser.monthFinishRate) || 0;
      if (completionRate > 0 && completionRate <= 1) {
        completionRate = completionRate * 100; // Convert 0.98 to 98
      }

      return {
        source: 'binance',
        externalId: adv.advNo,
        type: tradeType.toLowerCase(),
        cryptocurrency: adv.asset,
        fiatCurrency: adv.fiatUnit,
        price: parseFloat(adv.price),
        amount: parseFloat(adv.surplusAmount),
        availableAmount: parseFloat(adv.surplusAmount),
        minLimit: parseFloat(adv.minSingleTransAmount),
        maxLimit: parseFloat(adv.maxSingleTransAmount),
        paymentMethods: adv.tradeMethods?.map(method => this.mapPaymentMethod(method.identifier)) || [],
        description: adv.remarks || '', // Advertiser's terms/description
        user: {
          username: advertiser.nickName,
          completedTrades: parseInt(advertiser.monthOrderCount) || 0,
          rating: this.calculateRating(advertiser),
          completionRate: completionRate
        },
        status: 'active',
        createdAt: new Date()
      };
    });
  }

  /**
   * Calculate rating from Binance advertiser data
   */
  calculateRating(advertiser) {
    // Binance doesn't provide direct rating, so we calculate based on completion rate
    const finishRate = parseFloat(advertiser.monthFinishRate) || 0;
    const orderCount = parseInt(advertiser.monthOrderCount) || 0;
    
    // Generate rating based on completion rate and order count
    // High completion rate (>95%) = 5 stars
    // Medium completion rate (80-95%) = 4 stars
    // Lower completion rate = proportional
    if (finishRate >= 95 && orderCount > 50) return 5.0;
    if (finishRate >= 90 && orderCount > 20) return 4.8;
    if (finishRate >= 85) return 4.5;
    if (finishRate >= 80) return 4.2;
    if (finishRate >= 70) return 4.0;
    if (finishRate >= 60) return 3.5;
    return 3.0;
  }

  /**
   * Map Binance payment methods to display names
   */
  mapPaymentMethod(binanceMethod) {
    const methodMap = {
      'BANK': 'Bank Transfer',
      'Wise': 'Wise',
      'Revolut': 'Revolut',
      'PayPal': 'PayPal',
      'Paypal': 'PayPal',
      'Advcash': 'Advcash',
      'Skrill': 'Skrill',
      'Neteller': 'Neteller',
      'WebMoney': 'WebMoney',
      'Payoneer': 'Payoneer',
      'Zelle': 'Zelle',
      'CashApp': 'Cash App',
      'Venmo': 'Venmo',
      'Alipay': 'Alipay',
      'WeChat': 'WeChat Pay',
      'QIWI': 'QIWI Wallet',
      'YandexMoney': 'Yandex Money',
      'Paytm': 'Paytm',
      'UPI': 'UPI',
      'IMPS': 'IMPS',
      'Pix': 'Pix',
      'Mercado Pago': 'Mercado Pago',
      'PicPay': 'PicPay',
      'Nequi': 'Nequi',
      'Daviplata': 'Daviplata'
    };
    return methodMap[binanceMethod] || binanceMethod;
  }

  /**
   * Get available payment methods for a specific fiat currency
   */
  async getPaymentMethods(fiat = 'USD') {
    try {
      logger.info(`Fetching payment methods for ${fiat}`);

      // Fetch a sample of orders to extract payment methods
      const requestData = {
        page: 1,
        rows: 20, // Binance limits to 20 per request
        payTypes: [],
        asset: 'USDT', // Use USDT as it has most liquidity
        tradeType: 'BUY',
        fiat,
        publisherType: null,
        merchantCheck: false
      };

      const response = await axios.post(this.baseURL, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data && response.data.data) {
        const orders = response.data.data;
        
        logger.info(`Processing ${orders.length} orders to extract payment methods`);
        
        // Log first order structure for debugging
        if (orders.length > 0) {
          logger.info(`First order structure: ${JSON.stringify(orders[0], null, 2)}`);
        }
        
        // Extract unique payment methods from all orders
        const paymentMethodsSet = new Set();
        orders.forEach((order, index) => {
          if (order.adv && order.adv.tradeMethods) {
            order.adv.tradeMethods.forEach(method => {
              if (method.identifier) {
                paymentMethodsSet.add(method.identifier);
                if (index < 3) { // Log first 3 orders
                  logger.info(`Found payment method: ${method.identifier}`);
                }
              }
            });
          } else {
            if (index < 3) {
              logger.warn(`Order ${index} missing adv.tradeMethods`);
            }
          }
        });

        logger.info(`Total unique payment methods found: ${paymentMethodsSet.size}`);

        // Convert to array and map to display names
        const paymentMethods = Array.from(paymentMethodsSet).map(method => ({
          value: method,
          label: this.mapPaymentMethod(method)
        }));

        // Sort alphabetically and add "All Methods" at the beginning
        paymentMethods.sort((a, b) => a.label.localeCompare(b.label));
        paymentMethods.unshift({ value: '', label: 'All Methods' });

        logger.info(`Returning ${paymentMethods.length - 1} payment methods for ${fiat}`);
        return paymentMethods;
      }

      return [{ value: '', label: 'All Methods' }];
    } catch (error) {
      logger.error('Error fetching payment methods:', error.message);
      return [{ value: '', label: 'All Methods' }];
    }
  }

  /**
   * Get crypto prices from Binance
   */
  async getCryptoPrices(symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']) {
    try {
      const url = 'https://api.binance.com/api/v3/ticker/24hr';
      
      const prices = await Promise.all(
        symbols.map(async (symbol) => {
          const response = await axios.get(url, {
            params: { symbol }
          });
          
          return {
            symbol,
            price: parseFloat(response.data.lastPrice),
            change24h: parseFloat(response.data.priceChangePercent),
            volume24h: parseFloat(response.data.volume),
            high24h: parseFloat(response.data.highPrice),
            low24h: parseFloat(response.data.lowPrice)
          };
        })
      );

      return prices;
    } catch (error) {
      logger.error('Error fetching crypto prices from Binance:', error.message);
      throw error;
    }
  }
}

module.exports = new BinanceService();
