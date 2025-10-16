const express = require('express');
const router = express.Router();
const { protect } = require('../src/middleware/auth');
const PaymentMethod = require('../src/models/PaymentMethod');
const multer = require('multer');
const path = require('path');

// Налаштування multer для завантаження верифікаційних документів
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payment-verifications/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDFs are allowed'));
  },
});

// Отримати всі платіжні методи користувача
router.get('/', protect, async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ 
      user: req.user._id,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Додати новий платіжний метод
router.post('/', protect, async (req, res) => {
  try {
    const { type, currency, name, details } = req.body;

    // Валідація
    if (!type || !currency || !name) {
      return res.status(400).json({ message: 'Type, currency and name are required' });
    }

    const paymentMethod = new PaymentMethod({
      user: req.user._id,
      type,
      currency,
      name,
      details,
    });

    await paymentMethod.save();
    res.status(201).json(paymentMethod);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Оновити платіжний метод
router.put('/:id', protect, async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    const { name, details, isActive } = req.body;

    if (name) paymentMethod.name = name;
    if (details) paymentMethod.details = { ...paymentMethod.details, ...details };
    if (typeof isActive !== 'undefined') paymentMethod.isActive = isActive;

    await paymentMethod.save();
    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Видалити платіжний метод (м'яке видалення)
router.delete('/:id', protect, async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    paymentMethod.isActive = false;
    await paymentMethod.save();

    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Відправити на верифікацію
router.post('/:id/verify', protect, upload.single('document'), async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    if (req.file) {
      paymentMethod.verificationDocument = `/uploads/payment-verifications/${req.file.filename}`;
    }

    paymentMethod.verificationStatus = 'pending';
    await paymentMethod.save();

    res.json({ 
      message: 'Verification request submitted successfully',
      paymentMethod 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Отримати доступні типи платіжних методів
router.get('/types', (req, res) => {
  const paymentTypes = [
    {
      type: 'bank_card',
      name: 'Банківська карта',
      currencies: ['RUB', 'USD', 'EUR', 'UAH'],
      fields: ['cardNumber', 'cardHolder', 'bankName'],
      icon: '💳',
    },
    {
      type: 'yoomoney',
      name: 'ЮMoney (Яндекс.Деньги)',
      currencies: ['RUB'],
      fields: ['yoomoneyAccount'],
      icon: '💰',
    },
    {
      type: 'qiwi',
      name: 'QIWI Гаманець',
      currencies: ['RUB'],
      fields: ['qiwiPhone'],
      icon: '🥝',
    },
    {
      type: 'webmoney',
      name: 'WebMoney',
      currencies: ['RUB', 'USD', 'EUR'],
      fields: ['wmid'],
      icon: '💵',
    },
    {
      type: 'cash',
      name: 'Готівка',
      currencies: ['RUB', 'USD', 'EUR', 'UAH'],
      fields: ['city', 'meetingPlace'],
      icon: '💸',
    },
    {
      type: 'paypal',
      name: 'PayPal',
      currencies: ['USD', 'EUR'],
      fields: ['email'],
      icon: '🅿️',
    },
    {
      type: 'wise',
      name: 'Wise (TransferWise)',
      currencies: ['USD', 'EUR', 'UAH'],
      fields: ['email'],
      icon: '🌍',
    },
  ];

  res.json(paymentTypes);
});

module.exports = router;
