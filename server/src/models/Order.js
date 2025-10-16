const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  cryptocurrency: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'TRX']
  },
  fiatCurrency: {
    type: String,
    required: true,
    uppercase: true,
    default: 'USD'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  minLimit: {
    type: Number,
    required: true,
    min: 0
  },
  maxLimit: {
    type: Number,
    required: true,
    min: 0
  },
  availableAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethods: [{
    type: String,
    enum: ['bank_transfer', 'paypal', 'wise', 'revolut', 'cash', 'other']
  }],
  paymentTimeLimit: {
    type: Number,
    default: 30, // minutes
    min: 15,
    max: 120
  },
  terms: {
    type: String,
    maxlength: 1000
  },
  autoReply: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed', 'cancelled'],
    default: 'active'
  },
  source: {
    type: String,
    enum: ['platform', 'bybit'],
    default: 'platform'
  },
  bybitOrderId: {
    type: String,
    unique: true,
    sparse: true
  },
  region: {
    type: String,
    default: 'Global'
  },
  completedTrades: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isVerifiedOnly: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ cryptocurrency: 1, fiatCurrency: 1, type: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ bybitOrderId: 1 }, { sparse: true });
orderSchema.index({ price: 1 });

// Validate min/max limits
orderSchema.pre('save', function(next) {
  if (this.minLimit > this.maxLimit) {
    next(new Error('Min limit cannot be greater than max limit'));
  }
  if (this.maxLimit > this.amount * this.price) {
    next(new Error('Max limit cannot exceed total order value'));
  }
  next();
});

// Virtual for total value
orderSchema.virtual('totalValue').get(function() {
  return this.amount * this.price;
});

// Virtual for remaining value
orderSchema.virtual('remainingValue').get(function() {
  return this.availableAmount * this.price;
});

// Method to check if order can be fulfilled
orderSchema.methods.canFulfill = function(requestedAmount) {
  const requestedValue = requestedAmount * this.price;
  return (
    this.status === 'active' &&
    this.availableAmount >= requestedAmount &&
    requestedValue >= this.minLimit &&
    requestedValue <= this.maxLimit
  );
};

// Method to update available amount
orderSchema.methods.updateAvailableAmount = async function(amountUsed) {
  this.availableAmount -= amountUsed;
  if (this.availableAmount <= 0) {
    this.status = 'completed';
  }
  return await this.save();
};

// Set virtuals to be included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
