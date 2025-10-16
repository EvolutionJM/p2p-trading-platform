import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, QrCode, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import QRCodeReact from 'qrcode.react';

const DepositPage = () => {
  const [searchParams] = useSearchParams();
  const initialCurrency = searchParams.get('currency') || 'BTC';
  
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
  const [selectedNetwork, setSelectedNetwork] = useState('BTC');
  const [showQR, setShowQR] = useState(false);

  const currencies = [
    { code: 'BTC', name: 'Bitcoin', icon: '₿', networks: ['BTC', 'Lightning'] },
    { code: 'ETH', name: 'Ethereum', icon: 'Ξ', networks: ['ERC20', 'Arbitrum', 'Optimism'] },
    { code: 'USDT', name: 'Tether', icon: '₮', networks: ['ERC20', 'TRC20', 'BEP20'] },
    { code: 'BNB', name: 'Binance Coin', icon: 'B', networks: ['BEP20', 'BEP2'] },
  ];

  // Mock deposit address - замініть на реальну адресу з API
  const depositAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
  const minDeposit = 0.0001;

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Адресу скопійовано!');
  };

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <Link to="/wallet" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад до гаманця
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Поповнити гаманець</h1>
        <p className="text-gray-600 mb-8">Виберіть валюту та мережу для поповнення</p>

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
                      <div className="text-sm text-gray-500">{currency.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Deposit Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Network Selection */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Виберіть мережу</h2>
              <div className="grid grid-cols-2 gap-3">
                {selectedCurrencyData?.networks.map((network) => (
                  <button
                    key={network}
                    onClick={() => setSelectedNetwork(network)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedNetwork === network
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{network}</div>
                    <div className="text-sm text-gray-500 mt-1">Комісія: ~$0.50</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Важливо!</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Відправляйте тільки {selectedCurrency} на цю адресу</li>
                    <li>Мінімальна сума депозиту: {minDeposit} {selectedCurrency}</li>
                    <li>Мережа: {selectedNetwork}</li>
                    <li>Кошти будуть зараховані після 3 підтверджень</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Deposit Address */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Адреса для поповнення</h2>
              
              {/* QR Code */}
              {showQR && (
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <QRCodeReact value={depositAddress} size={200} />
                  </div>
                </div>
              )}

              {/* Address Input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={depositAddress}
                  readOnly
                  className="input pr-24 font-mono text-sm"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Показати QR код"
                  >
                    <QrCode className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(depositAddress)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Копіювати адресу"
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-2">Як поповнити:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Скопіюйте адресу вище або скануйте QR код</li>
                      <li>Відкрийте ваш зовнішній гаманець</li>
                      <li>Відправте {selectedCurrency} на цю адресу</li>
                      <li>Дочекайтесь підтвердження транзакції</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Deposits */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Останні депозити</h2>
              <div className="text-center py-8 text-gray-500">
                <p>Депозитів ще немає</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
