import React from 'react';
import { useTranslation } from 'react-i18next';

const CreateOrderPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">{t('order.createOrder')}</h1>
      <div className="card">
        <p>Create Order Form - Coming Soon</p>
      </div>
    </div>
  );
};

export default CreateOrderPage;
