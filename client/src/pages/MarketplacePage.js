import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { binanceAPI } from '../services/api';
import OrderCard from '../components/OrderCard';

const MarketplacePage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    type: 'buy',
    cryptocurrency: 'USDT',
    fiatCurrency: 'UAH', // Українська гривня за замовчуванням
    paymentMethod: '',
    page: 1
  });

  // Fetch orders
  const { data, isLoading, error } = useQuery({
    queryKey: ['binance-orders', filters],
    queryFn: () => binanceAPI.getOrders({
      asset: filters.cryptocurrency,
      fiat: filters.fiatCurrency,
      tradeType: filters.type.toUpperCase(),
      paymentMethod: filters.paymentMethod,
      rows: 20,
    }),
    refetchInterval: 30000,
  });

  // Fetch payment methods for selected fiat currency
  const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } = useQuery({
    queryKey: ['payment-methods', filters.fiatCurrency],
    queryFn: async () => {
      try {
        const response = await binanceAPI.getPaymentMethods(filters.fiatCurrency);
        console.log('Payment methods response:', response);
        return response;
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        return { paymentMethods: [{ value: '', label: 'All Methods' }] };
      }
    },
    staleTime: 300000, // Cache for 5 minutes
  });

  // Use payment methods from API or fallback to static list
  const paymentMethods = paymentMethodsData?.paymentMethods || [{ value: '', label: 'All Methods' }];
  
  console.log('Current payment methods:', paymentMethods);

  // Main cryptocurrencies
  const cryptocurrencies = [
    { code: 'USDT', name: 'Tether', icon: '₮' },
    { code: 'BTC', name: 'Bitcoin', icon: '₿' },
    { code: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { code: 'BNB', name: 'BNB', icon: '🔶' },
    { code: 'BUSD', name: 'BUSD', icon: '🟢' },
    { code: 'USDC', name: 'USD Coin', icon: '$' },
  ];

  // Binance supported fiat currencies
  const fiatCurrencies = [
    { code: 'UAH', name: 'Ukrainian Hryvnia', flag: '🇺🇦' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'ARS', name: 'Argentine Peso', flag: '🇦🇷' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
    { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱' },
    { code: 'KZT', name: 'Kazakhstani Tenge', flag: '🇰🇿' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
  ];

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('marketplace.title')}
        </h1>
        <p className="text-gray-600">
          Buy and sell cryptocurrency with other users
        </p>
      </div>

      {/* Buy/Sell Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6 inline-flex">
        <button
          onClick={() => setFilters({ ...filters, type: 'buy', page: 1 })}
          className={`px-8 py-3 font-semibold rounded-lg transition-all ${
            filters.type === 'buy'
              ? 'bg-success-500 text-white shadow-lg shadow-success-500/30'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <TrendingUp className="w-5 h-5 inline mr-2" />
          {t('marketplace.buy')}
        </button>
        <button
          onClick={() => setFilters({ ...filters, type: 'sell', page: 1 })}
          className={`px-8 py-3 font-semibold rounded-lg transition-all ${
            filters.type === 'sell'
              ? 'bg-danger-500 text-white shadow-lg shadow-danger-500/30'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <TrendingDown className="w-5 h-5 inline mr-2" />
          {t('marketplace.sell')}
        </button>
      </div>

      {/* Cryptocurrency Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {cryptocurrencies.map((crypto) => (
            <button
              key={crypto.code}
              onClick={() => setFilters({ ...filters, cryptocurrency: crypto.code, page: 1 })}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.cryptocurrency === crypto.code
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="mr-1.5">{crypto.icon}</span>
              {crypto.code}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Fiat Currency */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💵 Fiat Currency
            </label>
            <select
              value={filters.fiatCurrency}
              onChange={(e) => setFilters({ ...filters, fiatCurrency: e.target.value, page: 1 })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white hover:border-gray-300 transition-all font-medium text-gray-900 cursor-pointer"
              style={{ backgroundImage: 'none' }}
            >
              {fiatCurrencies.map((fiat) => (
                <option key={fiat.code} value={fiat.code}>
                  {fiat.flag} {fiat.code} - {fiat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💳 Payment Method
            </label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value, page: 1 })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white hover:border-gray-300 transition-all font-medium text-gray-900 cursor-pointer"
              style={{ backgroundImage: 'none' }}
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Search
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by merchant..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white hover:border-gray-300 transition-all font-medium text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card skeleton h-32" />
            ))}
          </div>
        ) : error ? (
          <div className="card text-center py-12">
            <p className="text-red-600 mb-4">Error loading orders</p>
            <button className="btn btn-primary">Retry</button>
          </div>
        ) : data?.orders?.length === 0 ? (
          <div className="card text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('marketplace.noOrders')}
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {data?.orders?.map((order, index) => (
                <OrderCard key={order._id || order.externalId || `order-${index}`} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.previous')}
                </button>
                <span className="text-gray-600">
                  Page {filters.page} of {data.pages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  disabled={filters.page === data.pages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
