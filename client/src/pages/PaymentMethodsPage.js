import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Plus, CreditCard, Wallet, DollarSign, Trash2, Edit, 
  CheckCircle, XCircle, Clock, AlertCircle 
} from 'lucide-react';
import axios from 'axios';

const PaymentMethodsPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
    fetchPaymentTypes();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/payment-methods', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaymentMethods(response.data);
    } catch (error) {
      toast.error('Не вдалося завантажити платіжні методи');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payment-methods/types');
      setPaymentTypes(response.data);
    } catch (error) {
      console.error('Failed to fetch payment types:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені що хочете видалити цей платіжний метод?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/payment-methods/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Платіжний метод видалено');
      fetchPaymentMethods();
    } catch (error) {
      toast.error('Не вдалося видалити платіжний метод');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      not_submitted: { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100', text: 'Не верифіковано' },
      pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'На перевірці' },
      approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Верифіковано' },
      rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'Відхилено' },
    };

    const config = statusConfig[status] || statusConfig.not_submitted;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getPaymentIcon = (type) => {
    const icons = {
      bank_card: '💳',
      yoomoney: '💰',
      qiwi: '🥝',
      webmoney: '💵',
      cash: '💸',
      paypal: '🅿️',
      wise: '🌍',
    };
    return icons[type] || '💳';
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Платіжні методи</h1>
            <p className="text-gray-600 mt-2">
              Додайте платіжні методи для купівлі та продажу криптовалюти
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Додати метод
          </button>
        </div>

        {/* Payment Methods List */}
        {paymentMethods.length === 0 ? (
          <div className="card text-center py-12">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Немає платіжних методів
            </h3>
            <p className="text-gray-600 mb-6">
              Додайте свій перший платіжний метод для початку торгівлі
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Додати платіжний метод
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div key={method._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{getPaymentIcon(method.type)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-500">
                        {paymentTypes.find(t => t.type === method.type)?.name}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(method.verificationStatus)}
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Валюта:</span>
                    <span className="ml-2 font-medium">{method.currency}</span>
                  </div>

                  {/* Show specific details based on type */}
                  {method.type === 'bank_card' && method.details.cardNumber && (
                    <div className="text-sm text-gray-600">
                      <span className="font-mono">**** **** **** {method.details.cardNumber.slice(-4)}</span>
                    </div>
                  )}
                  {method.type === 'yoomoney' && method.details.yoomoneyAccount && (
                    <div className="text-sm text-gray-600">
                      {method.details.yoomoneyAccount}
                    </div>
                  )}
                  {method.type === 'qiwi' && method.details.qiwiPhone && (
                    <div className="text-sm text-gray-600">
                      {method.details.qiwiPhone}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleDelete(method._id)}
                    className="btn btn-secondary btn-sm flex-1 inline-flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Payment Method Modal */}
        {showAddModal && (
          <AddPaymentMethodModal
            paymentTypes={paymentTypes}
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchPaymentMethods();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Add Payment Method Modal Component
const AddPaymentMethodModal = ({ paymentTypes, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    currency: '',
    details: {},
  });
  const [submitting, setSubmitting] = useState(false);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData({
      ...formData,
      currency: type.currencies[0],
    });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/payment-methods',
        {
          type: selectedType.type,
          currency: formData.currency,
          name: formData.name,
          details: formData.details,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Платіжний метод додано успішно!');
      onSuccess();
    } catch (error) {
      toast.error('Не вдалося додати платіжний метод');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? 'Оберіть тип платіжного методу' : 'Додати платіжний метод'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => handleTypeSelect(type)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{type.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-500">
                        {type.currencies.join(', ')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Назва методу *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Наприклад: Моя QIWI"
                  required
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Валюта *
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="input"
                  required
                >
                  {selectedType.currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic fields based on payment type */}
              {selectedType.type === 'bank_card' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Номер картки *
                    </label>
                    <input
                      type="text"
                      value={formData.details.cardNumber || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, cardNumber: e.target.value }
                      })}
                      className="input"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Власник картки *
                    </label>
                    <input
                      type="text"
                      value={formData.details.cardHolder || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, cardHolder: e.target.value }
                      })}
                      className="input"
                      placeholder="IVAN IVANOV"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Назва банку
                    </label>
                    <input
                      type="text"
                      value={formData.details.bankName || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, bankName: e.target.value }
                      })}
                      className="input"
                      placeholder="Сбербанк, Тинькофф, тощо"
                    />
                  </div>
                </>
              )}

              {selectedType.type === 'yoomoney' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Номер ЮMoney гаманця *
                  </label>
                  <input
                    type="text"
                    value={formData.details.yoomoneyAccount || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      details: { ...formData.details, yoomoneyAccount: e.target.value }
                    })}
                    className="input"
                    placeholder="410011234567890"
                    required
                  />
                </div>
              )}

              {selectedType.type === 'qiwi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Номер телефону QIWI *
                  </label>
                  <input
                    type="text"
                    value={formData.details.qiwiPhone || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      details: { ...formData.details, qiwiPhone: e.target.value }
                    })}
                    className="input"
                    placeholder="+79001234567"
                    required
                  />
                </div>
              )}

              {selectedType.type === 'webmoney' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WMID *
                  </label>
                  <input
                    type="text"
                    value={formData.details.wmid || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      details: { ...formData.details, wmid: e.target.value }
                    })}
                    className="input"
                    placeholder="123456789012"
                    required
                  />
                </div>
              )}

              {selectedType.type === 'cash' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Місто *
                    </label>
                    <input
                      type="text"
                      value={formData.details.city || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, city: e.target.value }
                      })}
                      className="input"
                      placeholder="Київ"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Місце зустрічі
                    </label>
                    <input
                      type="text"
                      value={formData.details.meetingPlace || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, meetingPlace: e.target.value }
                      })}
                      className="input"
                      placeholder="Метро Хрещатик"
                    />
                  </div>
                </>
              )}

              {(selectedType.type === 'paypal' || selectedType.type === 'wise') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.details.email || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      details: { ...formData.details, email: e.target.value }
                    })}
                    className="input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              )}

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Додаткова інформація
                </label>
                <textarea
                  value={formData.details.additionalInfo || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    details: { ...formData.details, additionalInfo: e.target.value }
                  })}
                  className="input"
                  rows="3"
                  placeholder="Додаткові деталі або інструкції"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary flex-1"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary flex-1 disabled:opacity-50"
                >
                  {submitting ? 'Додавання...' : 'Додати метод'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
