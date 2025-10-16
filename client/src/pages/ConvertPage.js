import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ArrowDownUp, TrendingUp, Info } from 'lucide-react';
import { toast } from 'sonner';

const ConvertPage = () => {
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('USDT');
  const [fromAmount, setFromAmount] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const currencies = [
    { code: 'BTC', name: 'Bitcoin', icon: '₿', balance: 0.05234, rate: 41234.56 },
    { code: 'ETH', name: 'Ethereum', icon: 'Ξ', balance: 1.2345, rate: 1899.23 },
    { code: 'USDT', name: 'Tether', icon: '₮', balance: 5000.00, rate: 1.00 },
    { code: 'BNB', name: 'Binance Coin', icon: 'B', balance: 10.5, rate: 250.00 },
    { code: 'USDC', name: 'USD Coin', icon: '$', balance: 2500.00, rate: 1.00 },
  ];

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);

  // Calculate conversion
  const conversionRate = fromCurrencyData && toCurrencyData 
    ? fromCurrencyData.rate / toCurrencyData.rate 
    : 0;
  
  const toAmount = fromAmount ? (parseFloat(fromAmount) * conversionRate).toFixed(8) : '';

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleConvert = async (e) => {
    e.preventDefault();

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Введіть суму для конвертації');
      return;
    }

    if (parseFloat(fromAmount) > fromCurrencyData.balance) {
      toast.error('Недостатньо коштів');
      return;
    }

    setIsConverting(true);
    try {
      // TODO: Implement actual conversion API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Успішно конвертовано ${fromAmount} ${fromCurrency} в ${toAmount} ${toCurrency}!`);
      setFromAmount('');
    } catch (error) {
      toast.error('Помилка при конвертації');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <Link to="/wallet" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад до гаманця
      </Link>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <RefreshCw className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Конвертація</h1>
          <p className="text-gray-600">Швидка конвертація з нульовими комісіями</p>
        </div>

        {/* Conversion Card */}
        <div className="card">
          <form onSubmit={handleConvert} className="space-y-6">
            {/* From Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ви віддаєте
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.00"
                  step="any"
                  className="input pr-32 text-lg"
                  required
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="bg-gray-100 border-0 rounded-lg px-3 py-2 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.icon} {currency.code}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setFromAmount(fromCurrencyData.balance.toString())}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-200 transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-500">
                  Доступно: {fromCurrencyData?.balance} {fromCurrency}
                </span>
                <span className="text-gray-900 font-medium">
                  ≈ ${(parseFloat(fromAmount || 0) * fromCurrencyData?.rate).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ArrowDownUp className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* To Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ви отримаєте
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  placeholder="0.00"
                  className="input pr-32 text-lg bg-gray-50"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="bg-gray-100 border-0 rounded-lg px-3 py-2 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.icon} {currency.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-500">
                  Баланс: {toCurrencyData?.balance} {toCurrency}
                </span>
                <span className="text-gray-900 font-medium">
                  ≈ ${(parseFloat(toAmount || 0) * toCurrencyData?.rate).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Exchange Rate */}
            {fromAmount && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Курс обміну</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-900">
                    1 {fromCurrency} = {conversionRate.toFixed(8)} {toCurrency}
                  </span>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">Переваги конвертації:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Нульова комісія за конвертацію</li>
                    <li>Миттєве виконання</li>
                    <li>Найкращі ринкові курси</li>
                    <li>Без прихованих платежів</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isConverting || !fromAmount || parseFloat(fromAmount) <= 0}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConverting ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Конвертація...
                </span>
              ) : (
                `Конвертувати ${fromCurrency} в ${toCurrency}`
              )}
            </button>
          </form>
        </div>

        {/* Recent Conversions */}
        <div className="card mt-6">
          <h2 className="font-semibold text-gray-900 mb-4">Останні конвертації</h2>
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p>Конвертацій ще немає</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertPage;
