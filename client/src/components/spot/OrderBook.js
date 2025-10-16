import React from 'react';

const OrderBook = ({ orderbook, loading, currentPrice }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <h3 className="font-bold text-xs text-gray-900">Order Book</h3>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-1 px-2 py-1 bg-gray-100 text-gray-500 font-semibold text-[9px] uppercase flex-shrink-0">
          <div>Price</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Total</div>
        </div>

        {/* Asks (Sell Orders) */}
        <div className="flex-1 overflow-y-auto">
          {orderbook.asks.slice(0, 10).reverse().map((order, idx) => (
            <div key={`ask-${idx}`} className="grid grid-cols-3 gap-1 px-2 py-0.5 hover:bg-red-50 relative transition-colors text-[9px]">
              <div className="absolute inset-0 bg-red-100 opacity-20" style={{ width: `${(order.amount / Math.max(...orderbook.asks.map(a => a.amount))) * 100}%` }}></div>
              <div className="text-red-600 font-bold relative z-10 truncate">
                {order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
              </div>
              <div className="text-right text-gray-700 relative z-10 truncate">
                {order.amount.toFixed(6)}
              </div>
              <div className="text-right text-gray-600 relative z-10 truncate">
                {order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Current Price */}
        <div className="px-2 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 border-y border-gray-200 flex-shrink-0">
          <span className={`text-sm font-bold ${currentPrice?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${currentPrice?.price ? currentPrice.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '-'}
          </span>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex-1 overflow-y-auto">
          {orderbook.bids.slice(0, 10).map((order, idx) => (
            <div key={`bid-${idx}`} className="grid grid-cols-3 gap-1 px-2 py-0.5 hover:bg-green-50 relative transition-colors text-[9px]">
              <div className="absolute inset-0 bg-green-100 opacity-20" style={{ width: `${(order.amount / Math.max(...orderbook.bids.map(b => b.amount))) * 100}%` }}></div>
              <div className="text-green-600 font-bold relative z-10 truncate">
                {order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
              </div>
              <div className="text-right text-gray-700 relative z-10 truncate">
                {order.amount.toFixed(6)}
              </div>
              <div className="text-right text-gray-600 relative z-10 truncate">
                {order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
