import React, { useEffect, useRef } from 'react';

const TradingViewChart = ({ symbol = 'BTCUSDT' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: '15',
          timezone: 'Europe/Kiev',
          theme: 'light',
          style: '1',
          locale: 'uk_UA',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: false,
          save_image: true,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          container_id: containerRef.current.id,
          studies: [
            'MASimple@tv-basicstudies'
          ],
          disabled_features: [
            'use_localstorage_for_settings'
          ],
          enabled_features: [
            'study_templates',
            'side_toolbar_in_fullscreen_mode',
            'header_in_fullscreen_mode'
          ],
          overrides: {
            'paneProperties.background': '#ffffff',
            'paneProperties.backgroundType': 'solid',
          },
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-full relative">
      <div 
        id={`tradingview_${symbol}`}
        ref={containerRef}
        className="w-full h-full tradingview-widget"
      />
      <style>{`
        .tradingview-widget iframe {
          border: none !important;
        }
        /* Hide TradingView branding */
        .tradingview-widget div[class*="tv-header"],
        .tradingview-widget div[class*="tv-embed-widget-wrapper__header"],
        .tradingview-widget a[href*="tradingview.com"],
        .tradingview-widget div[class*="branding"],
        .tradingview-widget div[class*="logo"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
      `}</style>
    </div>
  );
};

export default TradingViewChart;
