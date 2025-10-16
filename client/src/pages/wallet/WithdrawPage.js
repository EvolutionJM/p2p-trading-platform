import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Info, Shield } from 'lucide-react';
import { toast } from 'sonner';

const WithdrawPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCurrency = searchParams.get('currency') || 'BTC';
  
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
  const [selectedNetwork, setSelectedNetwork] = useState('BTC');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencies = [
    { 
      code: 'BTC', 
      name: 'Bitcoin', 
      icon: '₿', 
      networks: ['BTC', 'Lightning'],
      balance: 0.05234,
      minWithdraw: 0.001,
      fee: 0.0005
    },
    { 
      code: 'ETH', 
      name: 'Ethereum', 
      icon: 'Ξ', 
      networks: ['ERC20', 'Arbitrum', 'Optimism'],
      balance: 1.2345,
      minWithdraw: 0.01,
      fee: 0.005
    },
    { 
      code: 'USDT', 
      name: 'Tether', 
      icon: '₮', 
      networks: ['ERC20', 'TRC20', 'BEP20'],
      balance: 5000.00,
      minWithdraw: 10,
      fee: 1
    },
    { 
      code: 'BNB', 
      name: 'Binance Coin', 
      icon: 'B', 
      networks: ['BEP20', 'BEP2'],
      balance: 10.5,
      minWithdraw: 0.1,
      fee: 0.01
    },
  ];

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
  const receiveAmount = amount ? Math.max(0, parseFloat(amount) - selectedCurrencyData.fee) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!address) {
      toast.error('Введіть адресу отримувача');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Введіть суму виведення');
      return;
    }

    if (parseFloat(amount) < selectedCurrencyData.minWithdraw) {
      toast.error(`Мінімальна сума виведення: ${selectedCurrencyData.minWithdraw} ${selectedCurrency}`);
      return;
    }

    if (parseFloat(amount) > selectedCurrencyData.balance) {
      toast.error('Недостатньо коштів');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement actual withdrawal API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Запит на виведення створено!');
      navigate('/wallet');
    } catch (error) {
      toast.error('Помилка при виведенні коштів');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setMaxAmount = () => {
    const maxAmount = Math.max(0, selectedCurrencyData.balance - selectedCurrencyData.fee);
    setAmount(maxAmount.toString());
  };

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <Link to="/wallet" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад до гаманця
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Вивести кошти</h1>
        <p className="text-gray-600 mb-8">Виведіть криптовалюту на зовнішній гаманець</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Currency Selection */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Виберіть валюту</h2>
              <div className="space-y-2">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency.code);
                      setSelectedNetwork(currency.networks[0]);
                      setAmount('');
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      selectedCurrency === currency.code
                        ? 'bg-primary-50 border-2 border-primary-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {currency.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">{currency.code}</div>
                      <div className="text-sm text-gray-500">
                        {currency.balance} {currency.code}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Withdrawal Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Network Selection */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">Виберіть мережу</h2>
                <div className="grid grid-cols-2 gap-3">
                  {selectedCurrencyData?.networks.map((network) => (
                    <button
                      key={network}
                      type="button"
                      onClick={() => setSelectedNetwork(network)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedNetwork === network
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{network}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Комісія: {selectedCurrencyData.fee} {selectedCurrency}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Withdrawal Address */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">Адреса отримувача</h2>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={`Введіть ${selectedCurrency} адресу`}
                  className="input font-mono text-sm"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Переконайтеся, що адреса правильна. Транзакції незворотні!
                </p>
              </div>

              {/* Amount */}
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">Сума виведення</h2>
                
                <div className="relative mb-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="any"
                    min={selectedCurrencyData.minWithdraw}
                    max={selectedCurrencyData.balance}
                    className="input pr-24"
                    required
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <span className="text-gray-500 font-medium">{selectedCurrency}</span>
                    <button
                      type="button"
                      onClick={setMaxAmount}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-200 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Доступно:</span>
                    <span className="font-medium">
                      {selectedCurrencyData.balance} {selectedCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Комісія мережі:</span>
                    <span className="font-medium">
                      {selectedCurrencyData.fee} {selectedCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-semibold pt-2 border-t">
                    <span>Ви отримаєте:</span>
                    <span>
                      {receiveAmount.toFixed(8)} {selectedCurrency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-1">Безпека</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Перевірте адресу отримувача перед відправкою</li>
                      <li>Переконайтеся, що обрана правильна мережа</li>
                      <li>Транзакції незворотні після підтвердження</li>
                      <li>Мінімальна сума: {selectedCurrencyData.minWithdraw} {selectedCurrency}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !address || !amount}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Обробка...' : 'Підтвердити виведення'}
              </button>
            </form>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">Час обробки:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Виведення обробляються протягом 10-30 хвилин</li>
                    <li>Час підтвердження залежить від мережі</li>
                    <li>Ви отримаєте email після обробки</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
