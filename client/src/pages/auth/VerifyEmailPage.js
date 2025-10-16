import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Mail, RefreshCw, TrendingUp } from 'lucide-react';
import { authAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handlePinChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newPin = pastedData.split('');
    while (newPin.length < 6) newPin.push('');
    setPin(newPin);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`pin-${lastIndex}`)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pinCode = pin.join('');

    if (pinCode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.verifyEmail({ pin: pinCode });
      toast.success('✅ Email verified successfully!');
      updateUser({ isEmailVerified: true });
      
      // Show success message and redirect
      setTimeout(() => {
        toast.info('📋 Next step: Complete KYC verification to start trading');
        navigate('/kyc');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Invalid PIN');
      setPin(['', '', '', '', '', '']);
      document.getElementById('pin-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendPIN = async () => {
    setIsResending(true);
    try {
      await authAPI.resendPIN();
      toast.success('New PIN sent to your email');
      setPin(['', '', '', '', '', '']);
      document.getElementById('pin-0')?.focus();
    } catch (error) {
      toast.error(error.message || 'Failed to resend PIN');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We sent a 6-digit PIN to <strong>{user?.email}</strong>
            </p>
          </div>

          {/* PIN Input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter PIN Code
              </label>
              <div className="flex justify-center gap-2">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || pin.join('').length !== 6}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>

            {/* Resend PIN */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendPIN}
                disabled={isResending}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1"
              >
                <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Sending...' : 'Resend PIN'}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The PIN expires in 15 minutes. If it expires, request a new one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
