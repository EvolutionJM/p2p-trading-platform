import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AuthLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
