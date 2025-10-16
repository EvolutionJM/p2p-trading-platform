import React, { useState } from 'react';

const TradingForm = ({ symbol, currentPrice }) => {
  const [orderSide, setOrderSide] = useState('buy');
  const [orderType, setOrderType] = useState('limit');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock order placement
    alert(`Mock Order: ${orderSide.toUpperCase()} ${amount} ${symbol} at ${orderType === 'market' ? 'Market Price' : `$${price}`}`);
  };

  const calculateTotal = () => {
    if (!price || !amount) return '0.00';
    return (parseFloat(price) * parseFloat(amount)).toFixed(2);
  };

  const setPercentage = (percent) => {
    // Mock balance
    const mockBalance = orderSide === 'buy' ? 5000 : 0.125;
    if (orderSide === 'buy' && price) {
      const amountToBuy = (mockBalance * percent / 100) / parseFloat(price);
      setAmount(amountToBuy.toFixed(6));
    } else {
      setAmount((mockBalance * percent / 100).toFixed(6));
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-2 flex-1 overflow-y-auto">
        {/* Buy/Sell Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-1.5">
          <button
            onClick={() => setOrderSide('buy')}
            className={`py-2 rounded-lg font-bold text-sm transition-all ${
              orderSide === 'buy'
                ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setOrderSide('sell')}
            className={`py-2 rounded-lg font-bold text-sm transition-all ${
              orderSide === 'sell'
                ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Order Type Tabs */}
        <div className="flex space-x-1 mb-1.5 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setOrderType('limit')}
            className={`flex-1 py-1 rounded-md text-xs font-semibold transition-all ${
              orderType === 'limit'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Limit
          </button>
          <button
            onClick={() => setOrderType('market')}
            className={`flex-1 py-1 rounded-md text-xs font-semibold transition-all ${
              orderType === 'market'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('stop-limit')}
            className={`flex-1 py-1 rounded-md text-xs font-semibold transition-all ${
              orderType === 'stop-limit'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Stop-Limit
          </button>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between mb-1.5 text-xs bg-gray-50 px-2 py-1 rounded-lg">
          <span className="text-gray-600 font-medium">Available</span>
          <span className="font-bold text-gray-900">
            {orderSide === 'buy' ? '5,000.00 USDT' : '0.125 BTC'}
          </span>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-1">
          {orderType !== 'market' && (
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-0.5">
                Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={currentPrice?.price?.toFixed(2) || '0.00'}
                  className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                  USDT
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-0.5">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                BTC
              </span>
            </div>
          </div>

          {/* Percentage Buttons */}
          <div className="grid grid-cols-4 gap-1">
            {['25%', '50%', '75%', '100%'].map((percent) => (
              <button
                key={percent}
                type="button"
                onClick={() => setPercentage(parseInt(percent))}
                className="py-1 text-[10px] font-bold text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                {percent}
              </button>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1.5 rounded-lg">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="font-bold text-gray-900">{calculateTotal()} USDT</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-bold text-sm text-white transition-all shadow-lg ${
              orderSide === 'buy'
                ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                : 'bg-red-600 hover:bg-red-700 shadow-red-200'
            }`}
          >
            {orderSide === 'buy' ? 'Buy' : 'Sell'} {symbol?.replace('USDT', '')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TradingForm;
