import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-6 h-6 text-primary-500" />
              <span className="text-xl font-bold text-white">
                {t('common.appName')}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Secure P2P cryptocurrency trading platform with Bybit integration
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/marketplace" className="hover:text-primary-500 transition-colors">
                  {t('nav.marketplace')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-primary-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/aml" className="hover:text-primary-500 transition-colors">
                  AML Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-500 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@p2ptrading.com"
                className="hover:text-primary-500 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} P2P Crypto Trading. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
