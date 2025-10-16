import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ordersAPI } from '../services/api';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersAPI.getOrderById(id),
  });

  if (isLoading) {
    return <div className="container-custom py-8">Loading...</div>;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">{t('order.orderDetails')}</h1>
      <div className="card">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
