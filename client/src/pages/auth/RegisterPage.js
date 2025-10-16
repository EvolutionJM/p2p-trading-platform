import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Mail, Lock, User, Eye, EyeOff, TrendingUp } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await register(data);
      toast.success('Registration successful! Check your email for verification PIN.');
      navigate('/verify-email');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="card">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.register')}
          </h1>
          <p className="text-gray-600">
            Create your account to start trading
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.username')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                {...registerField('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  maxLength: {
                    value: 30,
                    message: 'Username cannot exceed 30 characters',
                  },
                })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="johndoe"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                {...registerField('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...registerField('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number',
                  },
                })}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.confirmPassword')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...registerField('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              type="checkbox"
              {...registerField('terms', {
                required: 'You must accept the terms and conditions',
              })}
              className="mt-1 mr-2"
            />
            <label className="text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm">{errors.terms.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('common.loading') : t('auth.register')}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
