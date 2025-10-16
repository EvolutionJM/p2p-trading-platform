const User = require('../models/User');
const logger = require('../utils/logger');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// @desc    Submit KYC documents
// @route   POST /api/kyc/submit
// @access  Private
exports.submitKYC = async (req, res) => {
  try {
    const { documentType, documentNumber, firstName, lastName, dateOfBirth, country } = req.body;
    const files = req.files;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload required documents'
      });
    }

    const user = await User.findById(req.user.id);

    if (user.kycStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'KYC already approved'
      });
    }

    // Process and save images
    const uploadDir = path.join(__dirname, '../../uploads/kyc', user._id.toString());
    await fs.mkdir(uploadDir, { recursive: true });

    const savedFiles = {};
    
    // Process each file type
    for (const [fieldName, fileArray] of Object.entries(files)) {
      const file = fileArray[0]; // Get first file from array
      const filename = `${fieldName}-${Date.now()}.jpg`;
      const filepath = path.join(uploadDir, filename);

      // Compress and save image
      await sharp(file.buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(filepath);

      savedFiles[fieldName] = filename;
    }

    // Update user KYC data
    user.kycStatus = 'pending';
    user.firstName = firstName;
    user.lastName = lastName;
    user.kycData = {
      documentType,
      documentNumber,
      dateOfBirth,
      country,
      documents: savedFiles,
      submittedAt: new Date()
    };

    await user.save();

    logger.info(`KYC submitted by user: ${user.email}`);

    res.json({
      success: true,
      message: 'KYC documents submitted successfully',
      kycStatus: user.kycStatus
    });
  } catch (error) {
    logger.error('Submit KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting KYC documents'
    });
  }
};

// @desc    Get all KYC applications (Admin)
// @route   GET /api/kyc/admin/applications
// @access  Private/Admin
exports.getKYCApplications = async (req, res) => {
  try {
    const applications = await User.find({
      kycStatus: { $in: ['pending', 'approved', 'rejected'] }
    }).select('username email kycStatus kycData firstName lastName createdAt');

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    logger.error('Get KYC applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KYC applications'
    });
  }
};

// @desc    Approve KYC (Admin)
// @route   PUT /api/kyc/admin/approve/:userId
// @access  Private/Admin
exports.approveKYC = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.kycStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'KYC is not pending approval'
      });
    }

    user.kycStatus = 'approved';
    user.kycData.approvedAt = new Date();
    await user.save();

    logger.info(`KYC approved for user: ${user.email} by admin: ${req.user.email}`);

    // Send approval email
    const { sendKYCApprovalEmail } = require('../services/emailService');
    await sendKYCApprovalEmail(user.email, user.username);

    res.json({
      success: true,
      message: 'KYC approved successfully'
    });
  } catch (error) {
    logger.error('Approve KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving KYC'
    });
  }
};

// @desc    Reject KYC (Admin)
// @route   PUT /api/kyc/admin/reject/:userId
// @access  Private/Admin
exports.rejectKYC = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.kycStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'KYC is not pending approval'
      });
    }

    user.kycStatus = 'rejected';
    user.kycData.rejectedAt = new Date();
    user.kycData.rejectionReason = reason;
    await user.save();

    logger.info(`KYC rejected for user: ${user.email} by admin: ${req.user.email}`);

    res.json({
      success: true,
      message: 'KYC rejected successfully'
    });
  } catch (error) {
    logger.error('Reject KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting KYC'
    });
  }
};

// @desc    Get KYC status
// @route   GET /api/kyc/status
// @access  Private
exports.getKYCStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      kycStatus: user.kycStatus,
      kycData: user.kycData
    });
  } catch (error) {
    logger.error('Get KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KYC status'
    });
  }
};

// @desc    Get pending KYC submissions
// @route   GET /api/kyc/pending
// @access  Private/Admin
exports.getPendingKYC = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find({ kycStatus: 'pending' })
      .sort('kycData.submittedAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments({ kycStatus: 'pending' });

    res.json({
      success: true,
      count: users.length,
      total,
      users
    });
  } catch (error) {
    logger.error('Get pending KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending KYC'
    });
  }
};

// @desc    Approve KYC
// @route   PUT /api/kyc/:userId/approve
// @access  Private/Admin
exports.approveKYC = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.kycStatus = 'approved';
    user.kycData.approvedAt = new Date();
    await user.save();

    logger.info(`KYC approved for user: ${user.email}`);

    res.json({
      success: true,
      message: 'KYC approved successfully'
    });
  } catch (error) {
    logger.error('Approve KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving KYC'
    });
  }
};

// @desc    Reject KYC
// @route   PUT /api/kyc/:userId/reject
// @access  Private/Admin
exports.rejectKYC = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.kycStatus = 'rejected';
    user.kycData.rejectedAt = new Date();
    user.kycData.rejectionReason = reason;
    await user.save();

    logger.info(`KYC rejected for user: ${user.email}`);

    res.json({
      success: true,
      message: 'KYC rejected'
    });
  } catch (error) {
    logger.error('Reject KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting KYC'
    });
  }
};
