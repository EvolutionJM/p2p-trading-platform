import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/spot';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
