import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Eye, 
  EyeOff,
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

const WalletPage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, crypto, fiat

  // Mock data - замініть на реальні дані з API
  const wallets = [
    {
      currency: 'BTC',
      name: 'Bitcoin',
      balance: 0.05234,
      usdValue: 2156.78,
      change24h: 2.5,
      icon: '₿',
      color: 'bg-orange-500'
    },
    {
      currency: 'ETH',
      name: 'Ethereum',
      balance: 1.2345,
      usdValue: 2345.67,
      change24h: -1.2,
      icon: 'Ξ',
      color: 'bg-blue-500'
    },
    {
      currency: 'USDT',
      name: 'Tether',
      balance: 5000.00,
      usdValue: 5000.00,
      change24h: 0.01,
      icon: '₮',
      color: 'bg-green-500'
    },
    {
      currency: 'BNB',
      name: 'Binance Coin',
      balance: 10.5,
      usdValue: 2625.00,
      change24h: 3.8,
      icon: 'B',
      color: 'bg-yellow-500'
    },
    {
      currency: 'USD',
      name: 'US Dollar',
      balance: 1250.00,
      usdValue: 1250.00,
      change24h: 0,
      icon: '$',
      color: 'bg-gray-500',
      isFiat: true
    },
  ];

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.usdValue, 0);

  const filteredWallets = wallets.filter(wallet => {
    const matchesSearch = 
      wallet.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'crypto' && !wallet.isFiat) ||
      (filter === 'fiat' && wallet.isFiat);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Мій гаманець</h1>
        <p className="text-gray-600">Керуйте своїми активами та балансами</p>
      </div>

      {/* Total Balance Card */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Загальний баланс</h2>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="mb-6">
          <div className="text-4xl font-bold mb-1">
            {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
          </div>
          <div className="text-white/80 text-sm">≈ {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Link
            to="/wallet/deposit"
            className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowDownToLine className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Поповнити</span>
          </Link>
          <Link
            to="/wallet/withdraw"
            className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowUpFromLine className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Вивести</span>
          </Link>
          <Link
            to="/convert"
            className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <RefreshCw className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Конвертувати</span>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук валюти..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Всі
            </button>
            <button
              onClick={() => setFilter('crypto')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'crypto' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Крипто
            </button>
            <button
              onClick={() => setFilter('fiat')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'fiat' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Фіат
            </button>
          </div>
        </div>
      </div>

      {/* Wallets List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Валюта</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Баланс</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">USD вартість</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">24h зміна</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Дії</th>
              </tr>
            </thead>
            <tbody>
              {filteredWallets.map((wallet) => (
                <tr key={wallet.currency} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${wallet.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                        {wallet.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{wallet.currency}</div>
                        <div className="text-sm text-gray-500">{wallet.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-semibold text-gray-900">
                      {showBalance ? wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '••••••'}
                    </div>
                    <div className="text-sm text-gray-500">{wallet.currency}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-semibold text-gray-900">
                      {showBalance ? `$${wallet.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className={`flex items-center justify-end space-x-1 ${wallet.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {wallet.change24h >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-semibold">
                        {wallet.change24h >= 0 ? '+' : ''}{wallet.change24h}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/wallet/deposit?currency=${wallet.currency}`}
                        className="btn btn-sm btn-secondary"
                      >
                        Поповнити
                      </Link>
                      <Link
                        to={`/wallet/withdraw?currency=${wallet.currency}`}
                        className="btn btn-sm btn-secondary"
                      >
                        Вивести
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWallets.length === 0 && (
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Валюти не знайдено</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
