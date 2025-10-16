import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, User, LogOut, Settings, FileText, TrendingUp, Wallet, Globe, CreditCard } from 'lucide-react';
import useAuthStore from '../store/authStore';
import MegaMenu from './MegaMenu';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">
              {t('common.appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Mega Menu */}
            <MegaMenu />
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Balance Display (for authenticated users) */}
            {isAuthenticated && (
              <Link 
                to="/wallet"
                className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Wallet className="w-4 h-4 text-gray-600" />
                <div className="text-left">
                  <div className="text-xs text-gray-500">Баланс</div>
                  <div className="text-sm font-semibold text-gray-900">$0.00</div>
                </div>
              </Link>
            )}
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5 text-gray-600" />
              </button>

              {langMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn max-h-96 overflow-y-auto">
                    {[
                      { code: 'uk', flag: '🇺🇦', name: 'Українська' },
                      { code: 'en', flag: '🇬🇧', name: 'English' },
                      { code: 'ru', flag: '🇷🇺', name: 'Русский' },
                      { code: 'es', flag: '🇪🇸', name: 'Español' },
                      { code: 'fr', flag: '🇫🇷', name: 'Français' },
                      { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
                      { code: 'it', flag: '🇮🇹', name: 'Italiano' },
                      { code: 'pt', flag: '🇵🇹', name: 'Português' },
                      { code: 'pl', flag: '🇵🇱', name: 'Polski' },
                      { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
                      { code: 'zh', flag: '🇨🇳', name: '中文' },
                      { code: 'ja', flag: '🇯🇵', name: '日本語' },
                      { code: 'ko', flag: '🇰🇷', name: '한국어' },
                      { code: 'ar', flag: '🇸🇦', name: 'العربية' },
                      { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-primary-50 transition-colors ${
                          i18n.language === lang.code ? 'bg-primary-50' : ''
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-white">{user?.username}</span>
                  <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/wallet"
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-primary-50 transition-colors group"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Wallet className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                          <span className="text-sm text-gray-700 group-hover:text-primary-600">Гаманець</span>
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-primary-50 transition-colors group"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                          <span className="text-sm text-gray-700 group-hover:text-primary-600">{t('nav.profile')}</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-primary-50 transition-colors group"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                          <span className="text-sm text-gray-700 group-hover:text-primary-600">{t('nav.settings')}</span>
                        </Link>
                        <Link
                          to="/payment-methods"
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-primary-50 transition-colors group"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <CreditCard className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                          <span className="text-sm text-gray-700 group-hover:text-primary-600">Платіжні методи</span>
                        </Link>
                        <Link
                          to="/kyc"
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-primary-50 transition-colors group"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <FileText className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                          <span className="text-sm text-gray-700 group-hover:text-primary-600">KYC Verification</span>
                        </Link>
                        
                        {/* Admin Link */}
                        {(user?.role === 'admin' || user?.role === 'moderator') && (
                          <Link
                            to="/admin/kyc"
                            className="flex items-center space-x-3 px-4 py-2.5 hover:bg-purple-50 transition-colors group"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FileText className="w-4 h-4 text-purple-500 group-hover:text-purple-600" />
                            <span className="text-sm text-purple-700 group-hover:text-purple-600 font-medium">Admin Panel</span>
                          </Link>
                        )}
                      </div>
                      
                      <hr className="my-1 border-gray-100" />
                      
                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 transition-colors w-full text-left group"
                      >
                        <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                        <span className="text-sm text-gray-700 group-hover:text-red-600 font-medium">{t('nav.logout')}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-secondary">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-primary">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link
                to="/marketplace"
                className="px-4 py-2 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.marketplace')}
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/trades"
                    className="px-4 py-2 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.trades')}
                  </Link>
                  <Link
                    to="/profile"
                    className="px-4 py-2 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                  <Link
                    to="/settings"
                    className="px-4 py-2 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.settings')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-50 rounded-lg text-left text-red-600"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
