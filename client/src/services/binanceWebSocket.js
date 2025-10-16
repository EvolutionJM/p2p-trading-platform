class BinanceWebSocket {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect(streams) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    const streamNames = streams.join('/');
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streamNames}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('Binance WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.stream && data.data) {
          this.notifySubscribers(data.stream, data.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.attemptReconnect(streams);
    };
  }

  attemptReconnect(streams) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        this.connect(streams);
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(stream, callback) {
    if (!this.subscribers.has(stream)) {
      this.subscribers.set(stream, new Set());
    }
    this.subscribers.get(stream).add(callback);
  }

  unsubscribe(stream, callback) {
    if (this.subscribers.has(stream)) {
      this.subscribers.get(stream).delete(callback);
      if (this.subscribers.get(stream).size === 0) {
        this.subscribers.delete(stream);
      }
    }
  }

  notifySubscribers(stream, data) {
    if (this.subscribers.has(stream)) {
      this.subscribers.get(stream).forEach(callback => {
        callback(data);
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }

  // Helper methods for specific data streams
  subscribeTicker(symbol, callback) {
    const stream = `${symbol.toLowerCase()}@ticker`;
    this.subscribe(stream, callback);
    return stream;
  }

  subscribeTrades(symbol, callback) {
    const stream = `${symbol.toLowerCase()}@trade`;
    this.subscribe(stream, callback);
    return stream;
  }

  subscribeDepth(symbol, callback) {
    const stream = `${symbol.toLowerCase()}@depth20@100ms`;
    this.subscribe(stream, callback);
    return stream;
  }

  subscribeKline(symbol, interval, callback) {
    const stream = `${symbol.toLowerCase()}@kline_${interval}`;
    this.subscribe(stream, callback);
    return stream;
  }
}

// Singleton instance
const binanceWS = new BinanceWebSocket();

export default binanceWS;
