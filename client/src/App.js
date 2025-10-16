import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import CreateOrderPage from './pages/CreateOrderPage';
import TradesPage from './pages/TradesPage';
import TradeDetailsPage from './pages/TradeDetailsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import KYCPage from './pages/KYCPage';
import WalletPage from './pages/WalletPage';
import DepositPage from './pages/wallet/DepositPage';
import WithdrawPage from './pages/wallet/WithdrawPage';
import ConvertPage from './pages/ConvertPage';
import SpotTradingPage from './pages/SpotTradingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import AdminKYCPage from './pages/admin/AdminKYCPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import ProtectedRoute from './components/ProtectedRoute';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          {/* Email verification - protected but doesn't require email verified */}
          <Route element={<ProtectedRoute />}>
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Route>

          {/* Main routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/spot" element={<SpotTradingPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/create-order" element={<CreateOrderPage />} />
              <Route path="/trades" element={<TradesPage />} />
              <Route path="/trades/:id" element={<TradeDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/kyc" element={<KYCPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/wallet/deposit" element={<DepositPage />} />
              <Route path="/wallet/withdraw" element={<WithdrawPage />} />
              <Route path="/convert" element={<ConvertPage />} />
              <Route path="/payment-methods" element={<PaymentMethodsPage />} />
              <Route path="/admin/kyc" element={<AdminKYCPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
