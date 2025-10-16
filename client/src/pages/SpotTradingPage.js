import React, { useState } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import TradingViewChart from '../components/TradingViewChart';
import MarketsList from '../components/spot/MarketsList';
import OrderBook from '../components/spot/OrderBook';
import TradeHistory from '../components/spot/TradeHistory';
import TradingForm from '../components/spot/TradingForm';
import { useBinanceMarkets } from '../hooks/useBinanceMarkets';
import { useBinanceOrderbook } from '../hooks/useBinanceOrderbook';
import { useBinanceTrades } from '../hooks/useBinanceTrades';
import { useBinancePrice } from '../hooks/useBinancePrice';

const SpotTradingPageNew = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [showPairSelector, setShowPairSelector] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState('open-orders');
  
  // Хуки для даних
  const { markets, loading: marketsLoading, searchQuery, setSearchQuery } = useBinanceMarkets();
  const { orderbook, loading: orderbookLoading } = useBinanceOrderbook(selectedSymbol);
  const { trades, loading: tradesLoading } = useBinanceTrades(selectedSymbol);
  const { priceData, loading: priceLoading } = useBinancePrice(selectedSymbol);

  const handleSelectSymbol = (symbol) => {
    setSelectedSymbol(symbol);
    setShowPairSelector(false);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Pair Info with Dropdown */}
            <div className="flex items-center space-x-6 relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Star className="w-5 h-5 text-yellow-400" />
              </button>
              
              {/* Pair Selector Button */}
              <button 
                onClick={() => setShowPairSelector(!showPairSelector)}
                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              >
                <span className="text-xl font-bold text-gray-900">
                  {selectedSymbol.replace('USDT', '/USDT')}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showPairSelector ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showPairSelector && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-2xl z-50 max-h-96 overflow-hidden">
                  <MarketsList
                    markets={markets}
                    loading={marketsLoading}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedSymbol={selectedSymbol}
                    onSelectSymbol={handleSelectSymbol}
                  />
                </div>
              )}
              
              <div className="flex flex-col">
                <span className={`text-3xl font-bold ${priceData?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${priceData?.price ? priceData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '-'}
                </span>
                <span className={`text-sm font-medium ${priceData?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceData?.change >= 0 ? '▲' : '▼'} {priceData?.change ? Math.abs(priceData.change).toFixed(2) : '0.00'}%
                </span>
              </div>
            </div>

            {/* 24h Stats */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">24h High</div>
                <div className="text-sm font-bold text-gray-900">
                  ${priceData?.high ? priceData.high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">24h Low</div>
                <div className="text-sm font-bold text-gray-900">
                  ${priceData?.low ? priceData.low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '-'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">24h Volume</div>
                <div className="text-sm font-bold text-gray-900">
                  {priceData?.volume ? `$${(priceData.volume / 1000000).toFixed(2)}M` : '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 max-w-full overflow-y-auto" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="grid grid-cols-12 gap-4" style={{ minHeight: 'calc(100vh - 500px)' }}>
          {/* Left - Chart (expanded) */}
          <div className="col-span-8 flex flex-col">
            <div className="bg-white rounded-xl border border-gray-200 flex-1 min-h-0 shadow-sm">
              <div className="h-full">
                <TradingViewChart symbol={selectedSymbol} />
              </div>
            </div>
          </div>

          {/* Right - OrderBook, Trades & Trading Form */}
          <div className="col-span-4 flex flex-col gap-3">
            {/* OrderBook & Trades */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ height: '400px' }}>
              <div className="grid grid-cols-2 h-full">
                <div className="border-r border-gray-200">
                  <OrderBook
                    orderbook={orderbook}
                    loading={orderbookLoading}
                    currentPrice={priceData}
                  />
                </div>
                <div>
                  <TradeHistory
                    trades={trades}
                    loading={tradesLoading}
                  />
                </div>
              </div>
            </div>

            {/* Trading Form */}
            <div style={{ height: '280px' }}>
              <TradingForm
                symbol={selectedSymbol}
                currentPrice={priceData}
              />
            </div>
          </div>
        </div>

        {/* Bottom Panel - Orders & History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-4" style={{ height: '250px' }}>
          {/* Tabs */}
          <div className="border-b border-gray-200 px-4 py-2 flex items-center space-x-6">
            <button
              onClick={() => setActiveBottomTab('open-orders')}
              className={`px-3 py-2 text-sm font-semibold transition-colors relative ${
                activeBottomTab === 'open-orders'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Відкриті ордери (0)
              {activeBottomTab === 'open-orders' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveBottomTab('order-history')}
              className={`px-3 py-2 text-sm font-semibold transition-colors relative ${
                activeBottomTab === 'order-history'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Історія ордерів
              {activeBottomTab === 'order-history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveBottomTab('trade-history')}
              className={`px-3 py-2 text-sm font-semibold transition-colors relative ${
                activeBottomTab === 'trade-history'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Історія торгівлі
              {activeBottomTab === 'trade-history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveBottomTab('funds')}
              className={`px-3 py-2 text-sm font-semibold transition-colors relative ${
                activeBottomTab === 'funds'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Активи
              {activeBottomTab === 'funds' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 50px)' }}>
            {activeBottomTab === 'open-orders' && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">У вас немає відкритих ордерів</p>
              </div>
            )}
            {activeBottomTab === 'order-history' && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Історія ордерів порожня</p>
              </div>
            )}
            {activeBottomTab === 'trade-history' && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Історія торгівлі порожня</p>
              </div>
            )}
            {activeBottomTab === 'funds' && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Інформація про активи</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotTradingPageNew;
