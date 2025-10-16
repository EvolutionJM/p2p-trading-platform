import React, { useEffect, useRef } from 'react';

const VeriffWidget = ({ sessionUrl, onComplete, onError }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!sessionUrl || !containerRef.current) return;

    // Завантажити Veriff SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.veriff.me/sdk/js/1.0/veriff.min.js';
    script.async = true;

    script.onload = () => {
      if (window.Veriff) {
        const veriff = window.Veriff({
          host: sessionUrl,
          onSession: function(err, response) {
            if (err) {
              console.error('Veriff session error:', err);
              onError && onError(err);
              return;
            }
            console.log('Veriff session started:', response);
          }
        });

        veriff.setParams({
          vendorData: 'custom-data',
        });

        veriff.mount({
          formLabel: {
            givenName: "Ім'я",
            lastName: 'Прізвище',
          },
          submitBtnText: 'Продовжити',
          loadingText: 'Завантаження...',
        });

        // Слухати події
        window.addEventListener('veriff:finished', (event) => {
          console.log('Veriff finished:', event.detail);
          onComplete && onComplete(event.detail);
        });

        window.addEventListener('veriff:error', (event) => {
          console.error('Veriff error:', event.detail);
          onError && onError(event.detail);
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window.removeEventListener('veriff:finished', onComplete);
      window.removeEventListener('veriff:error', onError);
    };
  }, [sessionUrl, onComplete, onError]);

  return (
    <div ref={containerRef} className="veriff-widget-container">
      <div id="veriff-root"></div>
    </div>
  );
};

export default VeriffWidget;
