import { useState, useEffect } from 'react';
import binanceAPI from '../services/binanceAPI';

export const useBinanceTrades = (symbol) => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;

    let ws = null;

    const fetchInitialTrades = async () => {
      setLoading(true);
      const data = await binanceAPI.getRecentTrades(symbol, 50);
      setTrades(data);
      setLoading(false);
    };

    const connectWebSocket = () => {
      const streamName = `${symbol.toLowerCase()}@trade`;
      ws = new WebSocket(`wss://stream.binance.com:443/ws/${streamName}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        const newTrade = {
          id: data.t,
          price: parseFloat(data.p),
          amount: parseFloat(data.q),
          time: new Date(data.T).toLocaleTimeString('en-US', { hour12: false }),
          side: data.m ? 'sell' : 'buy'
        };

        setTrades(prev => [newTrade, ...prev].slice(0, 50));
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    fetchInitialTrades();
    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbol]);

  return { trades, loading };
};
