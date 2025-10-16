import axios from 'axios';

const BINANCE_API_BASE = 'https://api.binance.com';

class BinanceAPI {
  // Отримати всі торгові пари
  async getExchangeInfo() {
    try {
      const response = await axios.get(`${BINANCE_API_BASE}/api/v3/exchangeInfo`);
      return response.data.symbols
        .filter(s => s.status === 'TRADING' && s.quoteAsset === 'USDT')
        .map(s => ({
          symbol: s.symbol,
          baseAsset: s.baseAsset,
          quoteAsset: s.quoteAsset,
          pair: `${s.baseAsset}/${s.quoteAsset}`,
        }));
    } catch (error) {
      console.error('Error fetching exchange info:', error);
      return [];
    }
  }

  // Отримати ціни всіх пар
  async getAllPrices() {
    try {
      const response = await axios.get(`${BINANCE_API_BASE}/api/v3/ticker/24hr`);
      return response.data
        .filter(t => t.symbol.endsWith('USDT'))
        .map(t => ({
          symbol: t.symbol,
          price: parseFloat(t.lastPrice),
          change: parseFloat(t.priceChangePercent),
          high: parseFloat(t.highPrice),
          low: parseFloat(t.lowPrice),
          volume: parseFloat(t.quoteVolume),
        }));
    } catch (error) {
      console.error('Error fetching prices:', error);
      return [];
    }
  }

  // Отримати orderbook для пари
  async getOrderBook(symbol, limit = 20) {
    try {
      const response = await axios.get(`${BINANCE_API_BASE}/api/v3/depth`, {
        params: { symbol, limit }
      });
      return {
        bids: response.data.bids.map(([price, amount]) => ({
          price: parseFloat(price),
          amount: parseFloat(amount),
          total: parseFloat(price) * parseFloat(amount)
        })),
        asks: response.data.asks.map(([price, amount]) => ({
          price: parseFloat(price),
          amount: parseFloat(amount),
          total: parseFloat(price) * parseFloat(amount)
        }))
      };
    } catch (error) {
      console.error('Error fetching orderbook:', error);
      return { bids: [], asks: [] };
    }
  }

  // Отримати останні угоди
  async getRecentTrades(symbol, limit = 50) {
    try {
      const response = await axios.get(`${BINANCE_API_BASE}/api/v3/trades`, {
        params: { symbol, limit }
      });
      return response.data.map(t => ({
        id: t.id,
        price: parseFloat(t.price),
        amount: parseFloat(t.qty),
        time: new Date(t.time).toLocaleTimeString('en-US', { hour12: false }),
        side: t.isBuyerMaker ? 'sell' : 'buy'
      }));
    } catch (error) {
      console.error('Error fetching trades:', error);
      return [];
    }
  }

  // Отримати свічки для графіка
  async getKlines(symbol, interval = '15m', limit = 500) {
    try {
      const response = await axios.get(`${BINANCE_API_BASE}/api/v3/klines`, {
        params: { symbol, interval, limit }
      });
      return response.data.map(k => ({
        time: k[0] / 1000,
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5])
      }));
    } catch (error) {
      console.error('Error fetching klines:', error);
      return [];
    }
  }

  // Отримати 24h статистику для пари
  async get24hrStats(symbol) {
    try {
      const response = await axios.get(`${BINANCE_API_BASE}/api/v3/ticker/24hr`, {
        params: { symbol }
      });
      const data = response.data;
      return {
        symbol: data.symbol,
        price: parseFloat(data.lastPrice),
        change: parseFloat(data.priceChangePercent),
        high: parseFloat(data.highPrice),
        low: parseFloat(data.lowPrice),
        volume: parseFloat(data.quoteVolume),
        priceChange: parseFloat(data.priceChange)
      };
    } catch (error) {
      console.error('Error fetching 24hr stats:', error);
      return null;
    }
  }
}

export default new BinanceAPI();
