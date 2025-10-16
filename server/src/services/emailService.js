const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate 6-digit PIN
const generatePIN = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, pin, username) => {
  // Skip email if not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    logger.warn('Email service not configured, skipping email send');
    return true;
  }
  
  try {
    const mailOptions = {
      from: `"P2P Crypto Trading" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - P2P Crypto Trading',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .pin-box { background: white; border: 2px dashed #0ea5e9; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .pin { font-size: 32px; font-weight: bold; color: #0ea5e9; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to P2P Crypto Trading!</h1>
            </div>
            <div class="content">
              <h2>Hello ${username}!</h2>
              <p>Thank you for registering. To complete your registration, please verify your email address.</p>
              
              <div class="pin-box">
                <p style="margin: 0; color: #6b7280;">Your verification PIN:</p>
                <div class="pin">${pin}</div>
              </div>
              
              <p>Enter this PIN on the verification page to activate your account.</p>
              <p><strong>This PIN will expire in 15 minutes.</strong></p>
              
              <p>If you didn't create an account, please ignore this email.</p>
              
              <div class="footer">
                <p>&copy; 2025 P2P Crypto Trading. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Send email error:', error);
    return false;
  }
};

// Send KYC approval email
const sendKYCApprovalEmail = async (email, username) => {
  // Skip email if not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    logger.warn('Email service not configured, skipping email send');
    return true;
  }
  
  try {
    const mailOptions = {
      from: `"P2P Crypto Trading" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'KYC Verification Approved - P2P Crypto Trading',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ KYC Verification Approved!</h1>
            </div>
            <div class="content">
              <div class="success-icon">🎉</div>
              <h2>Congratulations ${username}!</h2>
              <p>Your KYC verification has been approved. You now have full access to all platform features:</p>
              <ul>
                <li>Create buy/sell orders</li>
                <li>Trade with other users</li>
                <li>Access to all payment methods</li>
                <li>Higher trading limits</li>
              </ul>
              <p>Start trading now!</p>
              <div class="footer">
                <p>&copy; 2025 P2P Crypto Trading. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`KYC approval email sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Send KYC approval email error:', error);
    return false;
  }
};

module.exports = {
  generatePIN,
  sendVerificationEmail,
  sendKYCApprovalEmail,
};
