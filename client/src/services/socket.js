import { io } from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Subscribe to order updates
  subscribeToOrders(cryptocurrency, fiatCurrency) {
    if (this.socket) {
      this.socket.emit('order:subscribe', { cryptocurrency, fiatCurrency });
    }
  }

  unsubscribeFromOrders(cryptocurrency, fiatCurrency) {
    if (this.socket) {
      this.socket.emit('order:unsubscribe', { cryptocurrency, fiatCurrency });
    }
  }

  // Join trade room
  joinTrade(tradeId) {
    if (this.socket) {
      this.socket.emit('trade:join', tradeId);
    }
  }

  leaveTrade(tradeId) {
    if (this.socket) {
      this.socket.emit('trade:leave', tradeId);
    }
  }

  // Send chat message
  sendChatMessage(tradeId, message) {
    if (this.socket) {
      this.socket.emit('chat:send', { tradeId, message });
    }
  }

  // Listen to events
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }
}

const socketService = new SocketService();
export default socketService;
