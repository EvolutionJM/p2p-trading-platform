import { useState, useEffect } from 'react';
import binanceAPI from '../services/binanceAPI';

export const useBinanceOrderbook = (symbol) => {
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;

    let ws = null;

    const fetchInitialOrderbook = async () => {
      setLoading(true);
      const data = await binanceAPI.getOrderBook(symbol, 20);
      setOrderbook(data);
      setLoading(false);
    };

    const connectWebSocket = () => {
      const streamName = `${symbol.toLowerCase()}@depth20@100ms`;
      ws = new WebSocket(`wss://stream.binance.com:443/ws/${streamName}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.bids && data.asks) {
          setOrderbook({
            bids: data.bids.slice(0, 20).map(([price, amount]) => ({
              price: parseFloat(price),
              amount: parseFloat(amount),
              total: parseFloat(price) * parseFloat(amount)
            })),
            asks: data.asks.slice(0, 20).map(([price, amount]) => ({
              price: parseFloat(price),
              amount: parseFloat(amount),
              total: parseFloat(price) * parseFloat(amount)
            }))
          });
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    fetchInitialOrderbook();
    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbol]);

  return { orderbook, loading };
};
