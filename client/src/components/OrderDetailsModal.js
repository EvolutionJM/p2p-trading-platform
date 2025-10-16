import React, { useState } from 'react';
import { X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import UserProfileModal from './UserProfileModal';

const OrderDetailsModal = ({ order, isOpen, onClose, onTrade }) => {
  const [fiatAmount, setFiatAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showUserProfile, setShowUserProfile] = useState(false);

  if (!isOpen || !order) return null;

  const isBuyOrder = order.type === 'buy';

  // Auto-calculate crypto amount when fiat amount changes
  const handleFiatChange = (value) => {
    setFiatAmount(value);
    if (value && order.price) {
      const crypto = (parseFloat(value) / order.price).toFixed(6);
      setCryptoAmount(crypto);
    } else {
      setCryptoAmount('');
    }
  };

  // Auto-calculate fiat amount when crypto amount changes
  const handleCryptoChange = (value) => {
    setCryptoAmount(value);
    if (value && order.price) {
      const fiat = (parseFloat(value) * order.price).toFixed(2);
      setFiatAmount(fiat);
    } else {
      setFiatAmount('');
    }
  };

  // Set max amount
  const handleMaxFiat = () => {
    const maxFiat = Math.min(order.maxLimit, order.availableAmount * order.price);
    handleFiatChange(maxFiat.toString());
  };

  const handleMaxCrypto = () => {
    const maxCrypto = Math.min(order.availableAmount, order.maxLimit / order.price);
    handleCryptoChange(maxCrypto.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Left Side - Order Details */}
        <div className="w-1/2 bg-gray-50 p-6 overflow-y-auto">
          {/* User Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {order.user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <button 
                    onClick={() => setShowUserProfile(true)}
                    className="hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    {order.user?.username || 'Anonymous'}
                  </button>
                  {order.user?.kycStatus === 'approved' && (
                    <span className="text-orange-500">🔥</span>
                  )}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{order.user?.completedTrades || 0} Order(s)</span>
                  <span>•</span>
                  <span>{order.user?.completionRate ? `${Math.round(order.user.completionRate)} %` : '0%'}</span>
                </div>
                <span className="text-xs text-green-600 flex items-center mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Онлайн
                </span>
              </div>
            </div>

            {/* Verification Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Електронна пошта
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                СМС
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Встановлення особи
              </span>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Доступно</span>
              <span className="font-semibold text-gray-900">
                {order.availableAmount?.toLocaleString()} {order.cryptocurrency}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Ліміти транзакцій</span>
              <span className="font-semibold text-gray-900">
                {order.minLimit?.toLocaleString()} ~ {order.maxLimit?.toLocaleString()} {order.fiatCurrency}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Тривалість проведення платежу</span>
              <span className="font-semibold text-gray-900 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                15 хв.
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-600">Спосіб оплати</span>
              <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                {order.paymentMethods?.map((method, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white text-gray-700 rounded text-xs font-medium border border-gray-200"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Advertiser Terms */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
              <AlertCircle className="w-4 h-4 mr-2 text-gray-600" />
              Advertiser Terms
            </h3>
            <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-3">
              <p className="mb-2">
                Продавці можуть доповнювати Умови мерчанта. Уважно ознайомтеся з ними, перш як розмістити ордер. У разі виникнення суперечок переважну силу мають <span className="text-yellow-600 font-medium">Умови Платформи</span>. Захист платформи не поширюється на випадки порушень.
              </p>
            </div>
            {order.description && (
              <div className="text-xs text-gray-700 whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                {order.description}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Trading Form */}
        <div className="w-1/2 bg-white p-6 flex flex-col">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-sm text-gray-600">Ціна</span>
              <span className="text-2xl font-bold text-gray-900">
                {order.price?.toFixed(2)} {order.fiatCurrency}
              </span>
              <span className="text-sm text-gray-500">44s</span>
            </div>
          </div>

          {/* Trading Form */}
          <div className="flex-1 space-y-4">
            {/* Available for sale */}
            <div className="mb-4 text-sm text-gray-600">
              Доступно для продажу: {order.availableAmount?.toLocaleString()} {order.cryptocurrency}
            </div>

            {/* I Pay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isBuyOrder ? 'Я сплачу' : 'Я продам'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={fiatAmount}
                  onChange={(e) => handleFiatChange(e.target.value)}
                  className="w-full px-4 py-3 pr-24 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg font-semibold"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-gray-600 font-medium">{order.fiatCurrency}</span>
                  <button 
                    onClick={handleMaxFiat} 
                    type="button" 
                    className="text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    Усі
                  </button>
                </div>
              </div>
            </div>

            {/* I Receive */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isBuyOrder ? 'Я отримаю' : 'Я отримаю'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={cryptoAmount}
                  onChange={(e) => handleCryptoChange(e.target.value)}
                  className="w-full px-4 py-3 pr-24 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg font-semibold"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-gray-600 font-medium">{order.cryptocurrency}</span>
                  <button 
                    onClick={handleMaxCrypto} 
                    type="button" 
                    className="text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    Усі
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Виберіть спосіб оплати
              </label>
              <select 
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium cursor-pointer"
              >
                <option value="">Виберіть спосіб оплати</option>
                {order.paymentMethods?.map((method, index) => (
                  <option key={index} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Warning */}
          <p className="text-xs text-gray-500 text-center my-4">
            При ризику виплата може затриматися до 24 годин.
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Скасувати
            </button>
            <button
              onClick={() => onTrade(order)}
              className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-colors ${
                isBuyOrder
                  ? 'bg-success-500 hover:bg-success-600 text-white'
                  : 'bg-danger-500 hover:bg-danger-600 text-white'
              }`}
            >
              {isBuyOrder ? 'Купити' : 'Продати'}
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        user={order.user}
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </div>
  );
};

export default OrderDetailsModal;
