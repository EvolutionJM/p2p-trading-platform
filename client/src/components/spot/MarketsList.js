import React from 'react';
import { Search, Star } from 'lucide-react';

const MarketsList = ({ markets, loading, searchQuery, setSearchQuery, selectedSymbol, onSelectSymbol }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search pairs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Markets List */}
      <div className="flex-1 overflow-y-auto">
        {markets.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No markets found
          </div>
        ) : (
          markets.map((market) => (
            <button
              key={market.symbol}
              onClick={() => onSelectSymbol(market.symbol)}
              className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedSymbol === market.symbol ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-gray-900">{market.pair || `${market.baseAsset}/USDT`}</span>
                <Star className="w-4 h-4 text-gray-300 hover:text-yellow-400 transition-colors" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {market.price ? `$${market.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}` : '-'}
                </span>
                {market.change !== undefined && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    market.change >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                  }`}>
                    {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}%
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default MarketsList;
