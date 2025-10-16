import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendPIN: () => api.post('/auth/resend-pin'),
  setup2FA: () => api.post('/auth/2fa/setup'),
  verify2FA: (code) => api.post('/auth/2fa/verify', { code }),
  disable2FA: (code) => api.post('/auth/2fa/disable', { code }),
};

// Orders API
export const ordersAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  getMyOrders: (params) => api.get('/orders/user/my-orders', { params }),
};

// Trades API
export const tradesAPI = {
  createTrade: (data) => api.post('/trades', data),
  getMyTrades: (params) => api.get('/trades', { params }),
  getTradeById: (id) => api.get(`/trades/${id}`),
  confirmPayment: (id, proof) => api.put(`/trades/${id}/confirm-payment`, { proof }),
  releaseCrypto: (id) => api.put(`/trades/${id}/release`),
  cancelTrade: (id, reason) => api.put(`/trades/${id}/cancel`, { reason }),
  initiateDispute: (id, data) => api.put(`/trades/${id}/dispute`, data),
  sendMessage: (id, message) => api.post(`/trades/${id}/chat`, { message }),
  addRating: (id, data) => api.post(`/trades/${id}/rating`, data),
};

// Users API
export const usersAPI = {
  getUserProfile: (id) => api.get(`/users/${id}/profile`),
  getMyStats: () => api.get('/users/me/stats'),
  addPaymentMethod: (data) => api.post('/users/payment-methods', data),
  removePaymentMethod: (id) => api.delete(`/users/payment-methods/${id}`),
  removeWallet: (id) => api.delete(`/users/wallets/${id}`),
};

// KYC API
export const kycAPI = {
  submitKYC: (data) => api.post('/kyc/submit', data),
  getKYCStatus: () => api.get('/kyc/status'),
};

// Admin API
export const adminAPI = {
  getKYCApplications: () => api.get('/kyc/admin/applications'),
  approveKYC: (userId) => api.put(`/kyc/admin/approve/${userId}`),
  rejectKYC: (userId, data) => api.put(`/kyc/admin/reject/${userId}`, data),
};

// Bybit API
export const bybitAPI = {
  getOrders: (params) => api.get('/bybit/orders', { params }),
  getCryptoPrices: (symbols) => api.get('/bybit/prices', { params: { symbols } }),
  getMarketDepth: (symbol) => api.get(`/bybit/market-depth/${symbol}`),
  syncOrders: () => api.post('/bybit/sync'),
};

// Binance API
export const binanceAPI = {
  getOrders: (params) => api.get('/binance/orders', { params }),
  getCryptoPrices: (symbols) => api.get('/binance/prices', { params: { symbols } }),
  getPaymentMethods: (fiat) => api.get('/binance/payment-methods', { params: { fiat } }),
};

export default api;
