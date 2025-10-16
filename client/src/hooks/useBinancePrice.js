import { useState, useEffect } from 'react';
import binanceAPI from '../services/binanceAPI';

export const useBinancePrice = (symbol) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;

    let ws = null;

    const fetchInitialData = async () => {
      setLoading(true);
      const data = await binanceAPI.get24hrStats(symbol);
      setPriceData(data);
      setLoading(false);
    };

    const connectWebSocket = () => {
      const streamName = `${symbol.toLowerCase()}@ticker`;
      ws = new WebSocket(`wss://stream.binance.com:443/ws/${streamName}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        setPriceData({
          symbol: data.s,
          price: parseFloat(data.c),
          change: parseFloat(data.P),
          high: parseFloat(data.h),
          low: parseFloat(data.l),
          volume: parseFloat(data.q),
          priceChange: parseFloat(data.p)
        });
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    fetchInitialData();
    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbol]);

  return { priceData, loading };
};
