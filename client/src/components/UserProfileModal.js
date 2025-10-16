import React from 'react';
import { X, CheckCircle, ThumbsUp, ThumbsDown, AlertCircle, Star } from 'lucide-react';

const UserProfileModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>{user.username || 'Anonymous'}</span>
                {user.kycStatus === 'approved' && (
                  <span className="text-orange-500">🔥</span>
                )}
              </h2>
              <span className="text-sm text-green-600 flex items-center mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Онлайн
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 flex space-x-3">
          <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors">
            Заблокувати
          </button>
          <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors">
            Подати скаргу
          </button>
        </div>

        {/* Verification Badges */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              <CheckCircle className="w-4 h-4 mr-1" />
              Електронна пошта
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              <CheckCircle className="w-4 h-4 mr-1" />
              СМС
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              <CheckCircle className="w-4 h-4 mr-1" />
              Встановлення особи
            </span>
            {user.kycStatus === 'approved' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                <CheckCircle className="w-4 h-4 mr-1" />
                Депозит
              </span>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Orders completed in 30 days */}
            <div>
              <div className="text-sm text-gray-600 mb-1">Ордери, виконані за 30 днів</div>
              <div className="text-2xl font-bold text-gray-900">
                {user.completedTrades || 0} <span className="text-sm font-normal text-gray-600">Ордер(ів)</span>
              </div>
            </div>

            {/* All completed orders */}
            <div>
              <div className="text-sm text-gray-600 mb-1">Усі виконані ордери</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">{user.completedTrades || 0}</span>
                <div className="flex items-center space-x-1 text-xs">
                  <span className="text-gray-600">Купівля</span>
                  <span className="text-primary-600">0</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">Продаж</span>
                  <span className="text-danger-600">0</span>
                </div>
              </div>
            </div>

            {/* Completion rate */}
            <div>
              <div className="text-sm text-gray-600 mb-1 flex items-center">
                Рівень виконання протягом 30 днів
                <AlertCircle className="w-4 h-4 ml-1 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {user.completionRate ? `${Math.round(user.completionRate)}%` : '0%'}
              </div>
            </div>

            {/* Positive feedback */}
            <div>
              <div className="text-sm text-gray-600 mb-1 flex items-center">
                Позитивних оцінок, %
                <AlertCircle className="w-4 h-4 ml-1 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">0%</span>
                <div className="flex items-center space-x-1 text-sm">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">0</span>
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                  <span className="text-gray-600">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Date */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Підтверджено ім'я</span>
              <span className="font-semibold text-gray-900">****</span>
            </div>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Оголошення</h3>
            <div className="flex space-x-4 text-sm">
              <button className="text-primary-600 font-medium border-b-2 border-primary-600 pb-1">
                Оголошення
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                Залишіть відгук(0)
              </button>
            </div>
          </div>

          {/* No announcements message */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Продати цьому продавцю</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
