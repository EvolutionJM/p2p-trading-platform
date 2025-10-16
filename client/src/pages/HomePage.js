import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Shield, Zap, Globe, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Secure Trading',
      description: 'KYC verification and escrow protection for all trades'
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: 'Real-time Updates',
      description: 'Live order updates via WebSocket technology'
    },
    {
      icon: <Globe className="w-8 h-8 text-primary-600" />,
      title: 'Multi-language',
      description: 'Support for multiple languages and currencies'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
      title: 'Bybit Integration',
      description: 'Access to Bybit P2P orders directly on our platform'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              {t('common.appName')}
            </h1>
            <p className="text-xl mb-8 text-primary-100 animate-slide-up">
              Trade cryptocurrency peer-to-peer with confidence. Secure, fast, and reliable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/marketplace"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                {t('nav.marketplace')}
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link
                to="/register"
                className="btn bg-primary-700 text-white hover:bg-primary-800 px-8 py-3 text-lg border-2 border-white"
              >
                {t('auth.register')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best P2P trading experience with advanced features and security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">$50M+</div>
              <div className="text-gray-600">Trading Volume</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">99.9%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users trading cryptocurrency securely on our platform
          </p>
          <Link
            to="/register"
            className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg inline-flex items-center"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
