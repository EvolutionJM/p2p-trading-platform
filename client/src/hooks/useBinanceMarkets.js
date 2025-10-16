import { useState, useEffect } from 'react';
import binanceAPI from '../services/binanceAPI';

export const useBinanceMarkets = () => {
  const [markets, setMarkets] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Отримуємо всі пари та ціни
      const [marketsList, pricesList] = await Promise.all([
        binanceAPI.getExchangeInfo(),
        binanceAPI.getAllPrices()
      ]);

      setMarkets(marketsList);
      
      // Створюємо об'єкт цін для швидкого доступу
      const pricesMap = {};
      pricesList.forEach(p => {
        pricesMap[p.symbol] = p;
      });
      setPrices(pricesMap);
      
      setLoading(false);
    };

    fetchData();

    // Оновлюємо ціни кожні 10 секунд
    const interval = setInterval(async () => {
      const pricesList = await binanceAPI.getAllPrices();
      const pricesMap = {};
      pricesList.forEach(p => {
        pricesMap[p.symbol] = p;
      });
      setPrices(pricesMap);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Фільтрація пар за пошуковим запитом
  const filteredMarkets = markets.filter(m => 
    m.baseAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Додаємо ціни до пар
  const marketsWithPrices = filteredMarkets.map(m => ({
    ...m,
    ...(prices[m.symbol] || {})
  }));

  return {
    markets: marketsWithPrices,
    loading,
    searchQuery,
    setSearchQuery
  };
};
