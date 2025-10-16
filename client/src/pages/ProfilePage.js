import React from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';

const ProfilePage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">{t('profile.profile')}</h1>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">{t('profile.totalTrades')}</div>
            <div className="text-2xl font-bold">{user?.stats?.totalTrades || 0}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">{t('profile.completedTrades')}</div>
            <div className="text-2xl font-bold">{user?.stats?.completedTrades || 0}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">{t('profile.rating')}</div>
            <div className="text-2xl font-bold">{user?.stats?.rating?.toFixed(1) || '0.0'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
