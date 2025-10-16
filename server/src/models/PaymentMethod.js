const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['bank_card', 'yoomoney', 'qiwi', 'webmoney', 'cash', 'paypal', 'wise'],
    required: true,
  },
  currency: {
    type: String,
    enum: ['RUB', 'USD', 'EUR', 'UAH', 'KZT'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  details: {
    // Для банківської карти
    cardNumber: String,
    cardHolder: String,
    bankName: String,
    
    // Для ЮMoney
    yoomoneyAccount: String,
    
    // Для QIWI
    qiwiPhone: String,
    
    // Для WebMoney
    wmid: String,
    
    // Для готівки
    city: String,
    meetingPlace: String,
    
    // Для PayPal/Wise
    email: String,
    
    // Додаткова інформація
    additionalInfo: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  verificationDocument: {
    type: String, // URL до скріншоту/фото для верифікації
  },
  verificationStatus: {
    type: String,
    enum: ['not_submitted', 'pending', 'approved', 'rejected'],
    default: 'not_submitted',
  },
  rejectionReason: String,
}, {
  timestamps: true,
});

// Індекси
paymentMethodSchema.index({ user: 1, isActive: 1 });
paymentMethodSchema.index({ type: 1, currency: 1 });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
