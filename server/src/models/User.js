const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  kycStatus: {
    type: String,
    enum: ['not_submitted', 'not_started', 'pending', 'approved', 'rejected'],
    default: 'not_started'
  },
  verificationId: {
    type: String,
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  kycData: {
    documentType: String,
    documentNumber: String,
    dateOfBirth: Date,
    country: String,
    documents: {
      documentFront: String,
      documentBack: String,
      selfie: String
    },
    submittedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,
    rejectionReason: String
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationPIN: {
    type: String,
    select: false
  },
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'uk', 'ru', 'es', 'zh', 'fr', 'de', 'pt', 'ar']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  stats: {
    totalTrades: { type: Number, default: 0 },
    completedTrades: { type: Number, default: 0 },
    cancelledTrades: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 }
  },
  wallets: [{
    currency: String,
    address: String,
    network: String,
    isVerified: { type: Boolean, default: false }
  }],
  paymentMethods: [{
    type: {
      type: String,
      enum: ['bank_transfer', 'paypal', 'wise', 'revolut', 'cash', 'other']
    },
    details: mongoose.Schema.Types.Mixed,
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ kycStatus: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account lock
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  // Lock account after max attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.twoFactorSecret;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
