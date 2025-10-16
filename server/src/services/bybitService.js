const axios = require('axios');
const crypto = require('crypto');
const logger = require('../utils/logger');

class BybitService {
  constructor() {
    this.apiKey = process.env.BYBIT_API_KEY;
    this.apiSecret = process.env.BYBIT_API_SECRET;
    this.baseURL = process.env.BYBIT_TESTNET === 'true' 
      ? 'https://api-testnet.bybit.com'
      : 'https://api.bybit.com';
    this.recvWindow = 5000;
  }

  /**
   * Generate signature for authenticated requests
   */
  generateSignature(params) {
    const orderedParams = Object.keys(params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {});

    const queryString = Object.entries(orderedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(queryString)
      .digest('hex');
  }

  /**
   * Make authenticated request to Bybit API
   */
  async makeRequest(endpoint, method = 'GET', params = {}) {
    try {
      const timestamp = Date.now();
      const requestParams = {
        ...params,
        api_key: this.apiKey,
        timestamp,
        recv_window: this.recvWindow
      };

      const signature = this.generateSignature(requestParams);
      requestParams.sign = signature;

      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (method === 'GET') {
        config.params = requestParams;
      } else {
        config.data = requestParams;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(`Bybit API Error: ${error.response?.data?.ret_msg || error.message}`);
    }
  }

  /**
   * Fetch P2P orders from Bybit (Public Web API)
   */
  async fetchP2POrders(params = {}) {
    try {
      const {
        tokenId = 'USDT',
        currencyId = 'USD',
        side = '0', // 0 for buy, 1 for sell
        size = 50,
        page = 1
      } = params;

      // Bybit public web API endpoint (used by their website)
      const url = 'https://api2.bybit.com/fiat/otc/item/online';
      
      const response = await axios.post(url, {
        userId: '',
        tokenId,
        currencyId,
        payment: [],
        side,
        size,
        page,
        amount: ''
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      logger.info(`Bybit API response code: ${response.data.ret_code}`);

      if (response.data.ret_code === 0 && response.data.result) {
        const items = response.data.result.items || [];
        logger.info(`Fetched ${items.length} orders from Bybit`);
        return this.transformBybitOrders(items);
      }

      logger.warn('Bybit API returned no data, using mock orders');
      return this.generateMockOrders(tokenId, currencyId, side, size);
    } catch (error) {
      logger.error('Error fetching Bybit P2P orders:', error.message);
      logger.info('Falling back to mock orders');
      return this.generateMockOrders(params.tokenId, params.currencyId, params.side, params.size);
    }
  }

  /**
   * Generate realistic mock P2P orders for demo
   */
  generateMockOrders(tokenId = 'USDT', currencyId = 'USD', side = '0', count = 20) {
    const orders = [];
    const isBuy = side === '0';
    
    const basePrices = {
      'USDT': 1.00, 'BTC': 43250.00, 'ETH': 2280.00,
      'USDC': 1.00, 'BNB': 310.00, 'SOL': 98.50
    };

    const basePrice = basePrices[tokenId] || 1.00;
    const merchants = [
      'CryptoKing', 'TradeExpert', 'BitMaster', 'CoinDealer', 'FastTrade',
      'SecurePay', 'QuickExchange', 'TrustTrader', 'ProMerchant', 'GlobalCrypto'
    ];

    for (let i = 0; i < count; i++) {
      const priceVariation = isBuy ? (1 - Math.random() * 0.02) : (1 + Math.random() * 0.02);
      const price = basePrice * priceVariation;
      const amount = Math.random() * 10000 + 1000;
      
      orders.push({
        source: 'bybit',
        bybitOrderId: `mock-${Date.now()}-${i}`,
        type: isBuy ? 'buy' : 'sell',
        cryptocurrency: tokenId,
        fiatCurrency: currencyId,
        price: parseFloat(price.toFixed(2)),
        amount: parseFloat(amount.toFixed(2)),
        availableAmount: parseFloat((amount * (0.5 + Math.random() * 0.5)).toFixed(2)),
        minLimit: parseFloat((amount * 0.1).toFixed(2)),
        maxLimit: parseFloat(amount.toFixed(2)),
        paymentMethods: ['bank_transfer', 'wise', 'revolut'].slice(0, Math.floor(Math.random() * 2) + 1),
        user: {
          username: merchants[i % merchants.length],
          completedTrades: Math.floor(Math.random() * 1000) + 50,
          rating: parseFloat((4 + Math.random()).toFixed(1))
        },
        status: 'active',
        createdAt: new Date(Date.now() - Math.random() * 86400000)
      });
    }

    return orders;
  }

  /**
   * Transform Bybit orders to our format
   */
  transformBybitOrders(bybitOrders) {
    return bybitOrders.map(order => ({
      source: 'bybit',
      bybitOrderId: order.id,
      type: order.side === '0' ? 'buy' : 'sell',
      cryptocurrency: order.tokenId,
      fiatCurrency: order.currencyId,
      price: parseFloat(order.price),
      amount: parseFloat(order.quantity),
      availableAmount: parseFloat(order.lastQuantity),
      minLimit: parseFloat(order.minAmount),
      maxLimit: parseFloat(order.maxAmount),
      paymentMethods: order.payments?.map(p => this.mapPaymentMethod(p.type)) || [],
      user: {
        username: order.nickName,
        completedTrades: order.finishCount || 0,
        rating: order.recentOrderNum ? (order.recentExecuteRate / 100) * 5 : 0
      },
      status: 'active',
      createdAt: new Date(order.createDate)
    }));
  }

  /**
   * Map Bybit payment methods to our system
   */
  mapPaymentMethod(bybitMethod) {
    const methodMap = {
      'BANK': 'bank_transfer',
      'Paypal': 'paypal',
      'Wise': 'wise',
      'Revolut': 'revolut'
    };
    return methodMap[bybitMethod] || 'other';
  }

  /**
   * Get cryptocurrency prices
   */
  async getCryptoPrices(symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']) {
    try {
      const endpoint = '/v5/market/tickers';
      const params = {
        category: 'spot',
        symbol: symbols.join(',')
      };

      const response = await this.makeRequest(endpoint, 'GET', params);

      if (response.retCode === 0) {
        return response.result.list.map(ticker => ({
          symbol: ticker.symbol,
          price: parseFloat(ticker.lastPrice),
          change24h: parseFloat(ticker.price24hPcnt),
          volume24h: parseFloat(ticker.volume24h),
          high24h: parseFloat(ticker.highPrice24h),
          low24h: parseFloat(ticker.lowPrice24h)
        }));
      }

      throw new Error(response.retMsg || 'Failed to fetch prices');
    } catch (error) {
      logger.error('Error fetching crypto prices:', error);
      throw error;
    }
  }

  /**
   * Get market depth for a trading pair
   */
  async getMarketDepth(symbol = 'BTCUSDT', limit = 25) {
    try {
      const endpoint = '/v5/market/orderbook';
      const params = {
        category: 'spot',
        symbol,
        limit
      };

      const response = await this.makeRequest(endpoint, 'GET', params);

      if (response.retCode === 0) {
        return {
          symbol,
          bids: response.result.b.map(([price, qty]) => ({
            price: parseFloat(price),
            quantity: parseFloat(qty)
          })),
          asks: response.result.a.map(([price, qty]) => ({
            price: parseFloat(price),
            quantity: parseFloat(qty)
          })),
          timestamp: response.result.ts
        };
      }

      throw new Error(response.retMsg || 'Failed to fetch market depth');
    } catch (error) {
      logger.error('Error fetching market depth:', error);
      throw error;
    }
  }

  /**
   * Get account balance (if needed)
   */
  async getAccountBalance() {
    try {
      const endpoint = '/v5/account/wallet-balance';
      const params = {
        accountType: 'UNIFIED'
      };

      const response = await this.makeRequest(endpoint, 'GET', params);

      if (response.retCode === 0) {
        return response.result.list;
      }

      throw new Error(response.retMsg || 'Failed to fetch account balance');
    } catch (error) {
      logger.error('Error fetching account balance:', error);
      throw error;
    }
  }

  /**
   * Sync Bybit orders to local database
   */
  async syncBybitOrders(Order) {
    try {
      logger.info('Starting Bybit orders sync...');

      const cryptos = ['USDT', 'BTC', 'ETH'];
      const fiats = ['USD', 'EUR', 'GBP'];
      let totalSynced = 0;

      for (const crypto of cryptos) {
        for (const fiat of fiats) {
          try {
            // Fetch buy orders
            const buyOrders = await this.fetchP2POrders({
              tokenId: crypto,
              currencyId: fiat,
              side: '0',
              size: 20
            });

            // Fetch sell orders
            const sellOrders = await this.fetchP2POrders({
              tokenId: crypto,
              currencyId: fiat,
              side: '1',
              size: 20
            });

            const allOrders = [...buyOrders, ...sellOrders];

            // Update or create orders in database
            for (const orderData of allOrders) {
              await Order.findOneAndUpdate(
                { bybitOrderId: orderData.bybitOrderId },
                orderData,
                { upsert: true, new: true }
              );
              totalSynced++;
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            logger.error(`Error syncing ${crypto}/${fiat}:`, error.message);
          }
        }
      }

      logger.info(`Bybit sync completed. Total orders synced: ${totalSynced}`);
      return { success: true, totalSynced };
    } catch (error) {
      logger.error('Error in Bybit sync:', error);
      throw error;
    }
  }
}

module.exports = new BybitService();
