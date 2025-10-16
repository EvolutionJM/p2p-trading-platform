import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
