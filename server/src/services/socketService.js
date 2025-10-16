const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

let io;

// Initialize Socket.IO
exports.initializeSocket = (socketIO) => {
  io = socketIO;

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
      }
      
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}, User: ${socket.userId || 'guest'}`);

    // Join user's personal room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Subscribe to order updates
    socket.on('order:subscribe', (data) => {
      const { cryptocurrency, fiatCurrency } = data;
      const room = `orders:${cryptocurrency}:${fiatCurrency}`;
      socket.join(room);
      logger.info(`Socket ${socket.id} subscribed to ${room}`);
    });

    // Unsubscribe from order updates
    socket.on('order:unsubscribe', (data) => {
      const { cryptocurrency, fiatCurrency } = data;
      const room = `orders:${cryptocurrency}:${fiatCurrency}`;
      socket.leave(room);
      logger.info(`Socket ${socket.id} unsubscribed from ${room}`);
    });

    // Join trade room
    socket.on('trade:join', (tradeId) => {
      socket.join(`trade:${tradeId}`);
      logger.info(`Socket ${socket.id} joined trade ${tradeId}`);
    });

    // Leave trade room
    socket.on('trade:leave', (tradeId) => {
      socket.leave(`trade:${tradeId}`);
      logger.info(`Socket ${socket.id} left trade ${tradeId}`);
    });

    // Send chat message
    socket.on('chat:send', async (data) => {
      try {
        const { tradeId, message } = data;
        
        // Emit to trade room
        io.to(`trade:${tradeId}`).emit('chat:message', {
          tradeId,
          senderId: socket.userId,
          message,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Chat send error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Emit new order
exports.emitNewOrder = (order) => {
  if (io) {
    const room = `orders:${order.cryptocurrency}:${order.fiatCurrency}`;
    io.to(room).emit('order:new', order);
  }
};

// Emit order update
exports.emitOrderUpdate = (order) => {
  if (io) {
    const room = `orders:${order.cryptocurrency}:${order.fiatCurrency}`;
    io.to(room).emit('order:update', order);
  }
};

// Emit trade update
exports.emitTradeUpdate = (trade) => {
  if (io) {
    io.to(`trade:${trade._id}`).emit('trade:update', trade);
    
    // Notify buyer and seller
    io.to(`user:${trade.buyer}`).emit('notification', {
      type: 'trade_update',
      tradeId: trade._id,
      status: trade.status
    });
    
    io.to(`user:${trade.seller}`).emit('notification', {
      type: 'trade_update',
      tradeId: trade._id,
      status: trade.status
    });
  }
};

// Send notification to user
exports.sendNotification = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};

// Broadcast to all
exports.broadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = exports;
