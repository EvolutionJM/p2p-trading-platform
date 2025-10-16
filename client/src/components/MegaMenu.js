import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  Repeat,
  ShoppingCart,
  Zap,
  BookOpen,
  Users,
  Gift,
  ChevronRight
} from 'lucide-react';

const MegaMenu = () => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = [
    {
      id: 'buy-crypto',
      label: t('megaMenu.buyCrypto.title'),
      icon: ShoppingCart,
      items: [
        {
          icon: TrendingUp,
          title: t('megaMenu.buyCrypto.p2p.title'),
          description: t('megaMenu.buyCrypto.p2p.desc'),
          link: '/marketplace',
          badge: '0% комісії',
          badgeColor: 'bg-yellow-500'
        },
        {
          icon: Zap,
          title: t('megaMenu.buyCrypto.quickBuy.title'),
          description: t('megaMenu.buyCrypto.quickBuy.desc'),
          link: '/quick-buy',
        },
        {
          icon: Wallet,
          title: t('megaMenu.buyCrypto.deposit.title'),
          description: t('megaMenu.buyCrypto.deposit.desc'),
          link: '/wallet/deposit',
        },
        {
          icon: Repeat,
          title: t('megaMenu.buyCrypto.convert.title'),
          description: t('megaMenu.buyCrypto.convert.desc'),
          link: '/convert',
          badge: 'Популярне',
          badgeColor: 'bg-orange-500'
        },
      ]
    },
    {
      id: 'trading',
      label: t('megaMenu.trading.title'),
      icon: TrendingUp,
      items: [
        {
          icon: TrendingUp,
          title: t('megaMenu.trading.portal.title'),
          description: t('megaMenu.trading.portal.desc'),
          link: '/marketplace',
        },
        {
          icon: Zap,
          title: t('megaMenu.trading.spot.title'),
          description: t('megaMenu.trading.spot.desc'),
          link: '/spot',
          badge: 'Новинка',
          badgeColor: 'bg-primary-500'
        },
      ]
    },
    {
      id: 'wallet',
      label: t('megaMenu.wallet.title'),
      icon: Wallet,
      items: [
        {
          icon: Wallet,
          title: t('megaMenu.wallet.overview.title'),
          description: t('megaMenu.wallet.overview.desc'),
          link: '/wallet',
        },
        {
          icon: ArrowDownToLine,
          title: t('megaMenu.wallet.deposit.title'),
          description: t('megaMenu.wallet.deposit.desc'),
          link: '/wallet/deposit',
        },
        {
          icon: ArrowUpFromLine,
          title: t('megaMenu.wallet.withdraw.title'),
          description: t('megaMenu.wallet.withdraw.desc'),
          link: '/wallet/withdraw',
        },
      ]
    },
    {
      id: 'support',
      label: t('megaMenu.support.title'),
      icon: BookOpen,
      items: [
        {
          icon: BookOpen,
          title: t('megaMenu.support.center.title'),
          description: t('megaMenu.support.center.desc'),
          link: '/support',
        },
        {
          icon: Users,
          title: t('megaMenu.support.referral.title'),
          description: t('megaMenu.support.referral.desc'),
          link: '/referral',
        },
      ]
    },
  ];
  return (
    <div className="hidden lg:flex items-center space-x-1">
      {menuItems.map((menu) => (
        <div
          key={menu.id}
          className="relative"
          onMouseEnter={() => setActiveMenu(menu.id)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <button className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50">
            <menu.icon className="w-4 h-4" />
            <span className="font-medium">{menu.label}</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${activeMenu === menu.id ? 'rotate-90' : ''}`} />
          </button>

          {/* Mega Menu Dropdown */}
          {activeMenu === menu.id && (
            <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 z-50 animate-fadeIn">
              <div className="space-y-1">
                {menu.items.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                    onClick={() => setActiveMenu(null)}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                      <item.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </h3>
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-xs font-medium text-white rounded ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MegaMenu;
