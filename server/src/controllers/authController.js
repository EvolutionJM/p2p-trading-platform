const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../utils/logger');
const { generatePIN, sendVerificationEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, username, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Generate PIN
    const pin = generatePIN();
    
    // Create user
    const user = await User.create({
      email,
      username,
      password,
      firstName,
      lastName,
      emailVerificationPIN: pin,
      emailVerificationExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
      isEmailVerified: false
    });

    // Send verification email
    await sendVerificationEmail(email, pin, username);
    
    logger.info(`New user registered: ${user.email}`);

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in registration'
    });
  }
};

// @desc    Verify email with PIN
// @route   POST /api/auth/verify-email
// @access  Private
exports.verifyEmail = async (req, res) => {
  try {
    const { pin } = req.body;
    const userId = req.user.id;

    if (!pin) {
      return res.status(400).json({
        success: false,
        message: 'PIN is required'
      });
    }

    // Find user with PIN
    const user = await User.findById(userId).select('+emailVerificationPIN');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Check if PIN expired
    if (user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'PIN has expired. Please request a new one.'
      });
    }

    // Verify PIN
    if (user.emailVerificationPIN !== pin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PIN'
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationPIN = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    logger.info(`Email verified for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
        kycStatus: user.kycStatus
      }
    });
  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email'
    });
  }
};

// @desc    Resend verification PIN
// @route   POST /api/auth/resend-pin
// @access  Private
exports.resendPIN = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new PIN
    const pin = generatePIN();
    user.emailVerificationPIN = pin;
    user.emailVerificationExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send email
    await sendVerificationEmail(user.email, pin, user.username);

    logger.info(`Verification PIN resent to: ${user.email}`);

    res.json({
      success: true,
      message: 'Verification PIN sent to your email'
    });
  } catch (error) {
    logger.error('Resend PIN error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending PIN'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Generate temporary token for 2FA verification
      const tempToken = jwt.sign({ id: user._id, temp: true }, process.env.JWT_SECRET, {
        expiresIn: '10m'
      });

      return res.json({
        success: true,
        requires2FA: true,
        tempToken
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        kycStatus: user.kycStatus,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in login'
    });
  }
};

// @desc    Login with 2FA
// @route   POST /api/auth/2fa/login
// @access  Public (requires temp token)
exports.login2FA = async (req, res) => {
  try {
    const { tempToken, code } = req.body;

    if (!tempToken || !code) {
      return res.status(400).json({
        success: false,
        message: 'Temp token and 2FA code are required'
      });
    }

    // Verify temp token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    if (!decoded.temp) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Get user with 2FA secret
    const user = await User.findById(decoded.id).select('+twoFactorSecret');

    if (!user || !user.twoFactorEnabled) {
      return res.status(401).json({
        success: false,
        message: 'Invalid request'
      });
    }

    // Verify 2FA code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: 'Invalid 2FA code'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    logger.info(`User logged in with 2FA: ${user.email}`);

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        kycStatus: user.kycStatus,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    logger.error('2FA login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in 2FA login'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in logout'
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate new tokens
    const newToken = generateToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    logger.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, preferences } = req.body;

    const user = await User.findById(req.user.id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      user
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
};

// @desc    Setup 2FA
// @route   POST /api/auth/2fa/setup
// @access  Private
exports.setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled'
      });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `P2P Trading (${user.email})`
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Save secret (but don't enable yet)
    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({
      success: true,
      secret: secret.base32,
      qrCode
    });
  } catch (error) {
    logger.error('Setup 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting up 2FA'
    });
  }
};

// @desc    Verify and enable 2FA
// @route   POST /api/auth/2fa/verify
// @access  Private
exports.verify2FA = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findById(req.user.id).select('+twoFactorSecret');

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'Please setup 2FA first'
      });
    }

    // Verify code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: 'Invalid 2FA code'
      });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    await user.save();

    logger.info(`2FA enabled for user: ${user.email}`);

    res.json({
      success: true,
      message: '2FA enabled successfully'
    });
  } catch (error) {
    logger.error('Verify 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying 2FA'
    });
  }
};

// @desc    Disable 2FA
// @route   POST /api/auth/2fa/disable
// @access  Private
exports.disable2FA = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findById(req.user.id).select('+twoFactorSecret');

    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is not enabled'
      });
    }

    // Verify code before disabling
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: 'Invalid 2FA code'
      });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    logger.info(`2FA disabled for user: ${user.email}`);

    res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    logger.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error disabling 2FA'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // TODO: Send reset email
    logger.info(`Password reset requested for: ${user.email}`);

    res.json({
      success: true,
      message: 'Password reset email sent',
      resetToken // Remove in production
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for: ${user.email}`);

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};

// Old verify email and resend verification methods removed - using PIN verification instead
