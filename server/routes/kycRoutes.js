const express = require('express');
const router = express.Router();
const { protect } = require('../src/middleware/auth');
const veriffService = require('../services/veriffService');
const User = require('../src/models/User');

// Отримати статус KYC
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      status: user.kycStatus || 'not_started',
      verificationId: user.verificationId,
      verifiedAt: user.verifiedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Розпочати верифікацію
router.post('/start', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Створити реальну сесію Veriff
    const session = await veriffService.createSession(user._id, {
      firstName: user.firstName || 'User',
      lastName: user.lastName || user.username,
    });

    // Зберегти session ID
    user.verificationId = session.sessionId;
    user.kycStatus = 'pending';
    await user.save();

    console.log('✅ Veriff session created:', session.sessionId);

    res.json({
      sessionId: session.sessionId,
      url: session.url,
      sessionToken: session.sessionToken,
    });
  } catch (error) {
    console.error('Start KYC error:', error);
    console.error('Full error:', error.response?.data || error);
    res.status(500).json({ 
      message: 'Failed to start verification', 
      error: error.message,
      details: error.response?.data 
    });
  }
});

// Webhook від Veriff
router.post('/veriff/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-signature'];
    const payload = req.body;

    // Обробити webhook
    const result = await veriffService.handleWebhook(payload, signature);

    // Знайти користувача
    const user = await User.findById(result.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Оновити статус
    const mappedStatus = veriffService.mapStatus(result.status);
    user.kycStatus = mappedStatus;
    
    if (mappedStatus === 'approved') {
      user.verifiedAt = new Date();
    }

    await user.save();

    res.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: 'Webhook processing failed', error: error.message });
  }
});

// Перевірити статус сесії вручну
router.get('/check/:sessionId', protect, async (req, res) => {
  try {
    const status = await veriffService.getSessionStatus(req.params.sessionId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: 'Failed to check status', error: error.message });
  }
});

// Скинути KYC статус (для тестування)
router.post('/reset', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.kycStatus = 'not_started';
    user.verificationId = null;
    user.verifiedAt = null;
    await user.save();
    
    res.json({ message: 'KYC status reset successfully', status: 'not_started' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset status', error: error.message });
  }
});

module.exports = router;
