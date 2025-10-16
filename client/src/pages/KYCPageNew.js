import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import VeriffWidget from '../components/VeriffWidget';
import axios from 'axios';

const KYCPageNew = () => {
  const navigate = useNavigate();
  const [sessionUrl, setSessionUrl] = useState(null);
  const [kycStatus, setKycStatus] = useState('not_started'); // not_started, pending, approved, rejected
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkKYCStatus();
  }, []);

  const checkKYCStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kyc/status', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('KYC Status Response:', response.data);
      console.log('Status:', response.data.status);
      setKycStatus(response.data.status);
      setLoading(false);
    } catch (error) {
      console.error('Error checking KYC status:', error);
      // Якщо помилка - встановимо not_started
      setKycStatus('not_started');
      setLoading(false);
    }
  };

  const startKYC = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/kyc/start', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('KYC Response:', response.data);
      setSessionUrl(response.data.url);
      setKycStatus('pending');
      setLoading(false);
    } catch (error) {
      console.error('Error starting KYC:', error);
      console.error('Error details:', error.response?.data);
      alert('Помилка: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  const handleKYCComplete = (data) => {
    console.log('KYC completed:', data);
    setKycStatus('pending');
  };

  const handleKYCError = (error) => {
    console.error('KYC error:', error);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Верифікація особи (KYC)</h1>
          <p className="text-gray-600">
            Підтвердіть свою особу для доступу до всіх функцій платформи
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {(kycStatus === 'not_started' || kycStatus === 'not_submitted') && (
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Верифікація не розпочата</h2>
              <p className="text-gray-600 mb-6">
                Пройдіть верифікацію для підвищення лімітів та доступу до всіх функцій
              </p>
              <button
                onClick={startKYC}
                className="btn-primary px-8 py-3"
              >
                Розпочати верифікацію
              </button>
            </div>
          )}

          {kycStatus === 'pending' && !sessionUrl && (
            <div className="text-center">
              <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Перевірка документів</h2>
              <p className="text-gray-600 mb-4">
                Ваші документи на перевірці. Зазвичай це займає 5-15 хвилин.
              </p>
              <button
                onClick={async () => {
                  try {
                    await axios.post('http://localhost:5000/api/kyc/reset', {}, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setKycStatus('not_started');
                  } catch (error) {
                    console.error('Reset error:', error);
                  }
                }}
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                Почати верифікацію знову
              </button>
            </div>
          )}

          {kycStatus === 'approved' && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Верифікація пройдена!</h2>
              <p className="text-gray-600 mb-6">
                Ваш акаунт успішно верифіковано. Тепер доступні всі функції платформи.
              </p>
              <button
                onClick={() => navigate('/wallet')}
                className="btn-primary px-8 py-3"
              >
                Перейти до гаманця
              </button>
            </div>
          )}

          {kycStatus === 'rejected' && (
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Верифікація відхилена</h2>
              <p className="text-gray-600 mb-6">
                На жаль, ваші документи не пройшли перевірку. Спробуйте ще раз з коректними документами.
              </p>
              <button
                onClick={startKYC}
                className="btn-primary px-8 py-3"
              >
                Спробувати знову
              </button>
            </div>
          )}
        </div>

        {/* Veriff Widget */}
        {sessionUrl && kycStatus === 'pending' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <VeriffWidget
              sessionUrl={sessionUrl}
              onComplete={handleKYCComplete}
              onError={handleKYCError}
            />
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-2">Швидко</h3>
            <p className="text-sm text-gray-600">Верифікація займає 5-15 хвилин</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-2">Безпечно</h3>
            <p className="text-sm text-gray-600">Ваші дані захищені шифруванням</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-2">Необхідно</h3>
            <p className="text-sm text-gray-600">Паспорт або ID карта + селфі</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCPageNew;
