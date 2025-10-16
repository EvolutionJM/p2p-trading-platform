const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cryptocurrency: {
    type: String,
    required: true,
    uppercase: true
  },
  fiatCurrency: {
    type: String,
    required: true,
    uppercase: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalValue: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending',           // Trade initiated
      'payment_pending',   // Waiting for buyer payment
      'payment_confirmed', // Buyer confirmed payment
      'disputed',          // Trade disputed
      'completed',         // Trade completed successfully
      'cancelled',         // Trade cancelled
      'expired'           // Trade expired
    ],
    default: 'pending'
  },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String
  }],
  paymentDetails: {
    method: String,
    accountInfo: mongoose.Schema.Types.Mixed,
    reference: String,
    proof: [String] // URLs to payment proof images
  },
  chat: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    isSystemMessage: { type: Boolean, default: false }
  }],
  dispute: {
    isDisputed: { type: Boolean, default: false },
    initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    evidence: [String],
    resolution: String,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date
  },
  rating: {
    buyerRating: {
      score: { type: Number, min: 1, max: 5 },
      comment: String,
      timestamp: Date
    },
    sellerRating: {
      score: { type: Number, min: 1, max: 5 },
      comment: String,
      timestamp: Date
    }
  },
  expiresAt: {
    type: Date,
    required: true
  },
  completedAt: Date,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes
tradeSchema.index({ order: 1 });
tradeSchema.index({ buyer: 1, status: 1 });
tradeSchema.index({ seller: 1, status: 1 });
tradeSchema.index({ status: 1, createdAt: -1 });
tradeSchema.index({ expiresAt: 1 });

// Add status to timeline before saving
tradeSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Method to add chat message
tradeSchema.methods.addMessage = function(senderId, message, isSystem = false) {
  this.chat.push({
    sender: senderId,
    message: message,
    isSystemMessage: isSystem
  });
  return this.save();
};

// Method to confirm payment
tradeSchema.methods.confirmPayment = async function(proof) {
  this.status = 'payment_confirmed';
  if (proof && proof.length > 0) {
    this.paymentDetails.proof = proof;
  }
  return await this.save();
};

// Method to complete trade
tradeSchema.methods.complete = async function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return await this.save();
};

// Method to cancel trade
tradeSchema.methods.cancel = async function(userId, reason) {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelledBy = userId;
  this.cancellationReason = reason;
  return await this.save();
};

// Method to initiate dispute
tradeSchema.methods.initiateDispute = async function(userId, reason, evidence) {
  this.status = 'disputed';
  this.dispute.isDisputed = true;
  this.dispute.initiator = userId;
  this.dispute.reason = reason;
  this.dispute.evidence = evidence || [];
  return await this.save();
};

// Method to add rating
tradeSchema.methods.addRating = async function(userId, score, comment) {
  const isBuyer = this.buyer.toString() === userId.toString();
  
  if (isBuyer) {
    this.rating.buyerRating = {
      score,
      comment,
      timestamp: new Date()
    };
  } else {
    this.rating.sellerRating = {
      score,
      comment,
      timestamp: new Date()
    };
  }
  
  return await this.save();
};

// Check if trade is expired
tradeSchema.methods.isExpired = function() {
  return this.expiresAt < new Date() && this.status === 'payment_pending';
};

module.exports = mongoose.model('Trade', tradeSchema);
