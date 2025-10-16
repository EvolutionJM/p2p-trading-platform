import React from 'react';

const TradeHistory = ({ trades, loading }) => {
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
        <h3 className="font-bold text-xs text-gray-900">Recent Trades</h3>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-1 px-2 py-1 bg-gray-100 text-gray-500 font-semibold text-[9px] uppercase flex-shrink-0">
          <div>Price</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Time</div>
        </div>

        {/* Trades List */}
        <div className="flex-1 overflow-y-auto">
          {trades.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-xs">
              No trades yet
            </div>
          ) : (
            trades.map((trade) => (
              <div 
                key={trade.id} 
                className={`grid grid-cols-3 gap-1 px-2 py-0.5 hover:bg-gray-50 transition-colors text-[9px] ${
                  trade.side === 'buy' ? 'hover:bg-green-50' : 'hover:bg-red-50'
                }`}
              >
                <div className={`font-bold truncate ${trade.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                </div>
                <div className="text-right text-gray-700 truncate">
                  {trade.amount.toFixed(6)}
                </div>
                <div className="text-right text-gray-500 truncate">
                  {trade.time}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;
