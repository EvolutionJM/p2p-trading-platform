const express = require('express');
const router = express.Router();
const multer = require('multer');
const kycController = require('../controllers/kycController');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Protected routes
router.post('/submit', protect, upload.fields([
  { name: 'documentFront', maxCount: 1 },
  { name: 'documentBack', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), kycController.submitKYC);
router.get('/status', protect, kycController.getKYCStatus);

// Admin routes
router.get('/admin/applications', protect, authorize('admin', 'moderator'), kycController.getKYCApplications);
router.put('/admin/approve/:userId', protect, authorize('admin', 'moderator'), kycController.approveKYC);
router.put('/admin/reject/:userId', protect, authorize('admin', 'moderator'), kycController.rejectKYC);

module.exports = router;
