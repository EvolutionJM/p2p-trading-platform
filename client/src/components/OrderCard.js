import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

const OrderCard = ({ order }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const getTypeColor = (type) => {
    return type === 'buy' ? 'text-success-600 bg-success-50' : 'text-danger-600 bg-danger-50';
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {order.user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">
                {order.user?.username}
              </span>
              {order.user?.kycStatus === 'approved' && (
                <CheckCircle className="w-4 h-4 text-primary-600" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{(order.user?.rating || order.user?.stats?.rating || 0).toFixed(1)}</span>
              <span>•</span>
              <span>{order.user?.completedTrades || order.user?.stats?.completedTrades || 0} trades</span>
              {order.user?.completionRate > 0 && (
                <>
                  <span>•</span>
                  <span className="text-success-600">{Math.round(order.user.completionRate)}%</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Type */}
          <div>
            <div className="text-xs text-gray-500 mb-1">{t('order.type')}</div>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(order.type)}`}>
              {order.type.toUpperCase()}
            </span>
          </div>

          {/* Price */}
          <div>
            <div className="text-xs text-gray-500 mb-1">{t('order.price')}</div>
            <div className="font-semibold text-gray-900">
              {order.price.toFixed(2)} {order.fiatCurrency}
            </div>
          </div>

          {/* Available */}
          <div>
            <div className="text-xs text-gray-500 mb-1">{t('marketplace.available')}</div>
            <div className="font-semibold text-gray-900">
              {order.availableAmount.toFixed(4)} {order.cryptocurrency}
            </div>
          </div>

          {/* Limit */}
          <div>
            <div className="text-xs text-gray-500 mb-1">{t('marketplace.limit')}</div>
            <div className="text-sm text-gray-700">
              {order.minLimit} - {order.maxLimit} {order.fiatCurrency}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap gap-2">
          {order.paymentMethods?.slice(0, 2).map((method, index) => (
            <span
              key={index}
              className="badge badge-info text-xs"
            >
              {method.replace('_', ' ')}
            </span>
          ))}
          {order.paymentMethods?.length > 2 && (
            <span className="badge badge-info text-xs">
              +{order.paymentMethods.length - 2}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary whitespace-nowrap"
        >
          {t('order.tradeNow')}
          <ArrowRight className="w-4 h-4 ml-2 inline" />
        </button>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={order}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onTrade={(order) => {
          console.log('Trading order:', order);
          // Handle trade action
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default OrderCard;
