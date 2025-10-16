import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TradeDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">{t('trade.tradeDetails')}</h1>
      <div className="card">
        <p>Trade Details for ID: {id} - Coming Soon</p>
      </div>
    </div>
  );
};

export default TradeDetailsPage;
