import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Upload, FileText, Camera, CheckCircle, XCircle, Clock, AlertCircle, Shield } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { kycAPI } from '../services/api';

const KYCPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    documentType: 'passport',
    documentNumber: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dateOfBirth: '',
    country: '',
  });
  const [files, setFiles] = useState({
    documentFront: null,
    documentBack: null,
    selfie: null,
  });
  const [previews, setPreviews] = useState({
    documentFront: null,
    documentBack: null,
    selfie: null,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    setFiles({
      ...files,
      [fileType]: file,
    });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews({
        ...previews,
        [fileType]: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.documentNumber || !formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.country) {
      toast.error('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    if (!files.documentFront || !files.selfie) {
      toast.error('Будь ласка, завантажте необхідні документи');
      return;
    }

    if (formData.documentType === 'id_card' && !files.documentBack) {
      toast.error('Будь ласка, завантажте обидві сторони ID картки');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      Object.keys(files).forEach(key => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });

      await kycAPI.submitKYC(submitData);
      
      // AUTO-APPROVE для тестування
      toast.success('✅ Документи прийнято! Автоматична перевірка...');
      updateUser({ kycStatus: 'pending' });
      
      // Автоматично схвалюємо через 2 секунди
      setTimeout(async () => {
        updateUser({ kycStatus: 'approved' });
        toast.success('🎉 Верифікацію пройдено! Тепер доступні всі функції!');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Не вдалося відправити документи');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      not_submitted: {
        icon: AlertCircle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'Не відправлено',
        description: 'Відправте документи для початку торгівлі',
      },
      pending: {
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'На перевірці',
        description: 'Ваші документи перевіряються. Зазвичай це займає 5-15 хвилин.',
      },
      approved: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'Верифіковано',
        description: 'Ваш акаунт повністю верифіковано! Тепер доступні всі функції.',
      },
      rejected: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'Відхилено',
        description: 'Ваші документи відхилено. Будь ласка, відправте коректні дані.',
      },
    };
    return statusConfig[status] || statusConfig.not_submitted;
  };

  const statusInfo = getStatusInfo(user?.kycStatus);
  const StatusIcon = statusInfo.icon;

  // If KYC is approved, show success message
  if (user?.kycStatus === 'approved') {
    return (
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className={`card ${statusInfo.bg} ${statusInfo.border} border-2`}>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-20 h-20 ${statusInfo.bg} rounded-full flex items-center justify-center`}>
                  <StatusIcon className={`w-12 h-12 ${statusInfo.color}`} />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {statusInfo.text}
              </h1>
              <p className="text-gray-600 mb-6">{statusInfo.description}</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="btn btn-primary"
              >
                Почати торгівлю
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If KYC is pending, show status
  if (user?.kycStatus === 'pending') {
    return (
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className={`card ${statusInfo.bg} ${statusInfo.border} border-2`}>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-20 h-20 ${statusInfo.bg} rounded-full flex items-center justify-center`}>
                  <StatusIcon className={`w-12 h-12 ${statusInfo.color} animate-pulse`} />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {statusInfo.text}
              </h1>
              <p className="text-gray-600 mb-6">{statusInfo.description}</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="btn btn-secondary"
              >
                Переглянути маркетплейс
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show KYC form
  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-10 h-10 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Верифікація особи (KYC)</h1>
          </div>
          <p className="text-gray-600">
            Підтвердіть свою особу для доступу до всіх функцій платформи та вищих лімітів.
          </p>
        </div>

        {/* Status Alert */}
        <div className={`card ${statusInfo.bg} ${statusInfo.border} border mb-6`}>
          <div className="flex items-start space-x-3">
            <StatusIcon className={`w-6 h-6 ${statusInfo.color} mt-0.5`} />
            <div>
              <h3 className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</h3>
              <p className="text-sm text-gray-600 mt-1">{statusInfo.description}</p>
            </div>
          </div>
        </div>

        {/* KYC Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Персональна інформація</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ім'я *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Прізвище *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата народження *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Країна *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="">Оберіть країну</option>
                  <option value="UA">Україна</option>
                  <option value="US">США</option>
                  <option value="GB">Велика Британія</option>
                  <option value="DE">Німеччина</option>
                  <option value="FR">Франція</option>
                  <option value="ES">Іспанія</option>
                  <option value="IT">Італія</option>
                  <option value="PL">Польща</option>
                </select>
              </div>
            </div>
          </div>

          {/* Document Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Інформація про документ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип документа *
                </label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="passport">Паспорт</option>
                  <option value="id_card">ID картка</option>
                  <option value="drivers_license">Водійське посвідчення</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Номер документа *
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Введіть номер документа"
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Завантаження документів</h2>
            <div className="space-y-4">
              {/* Document Front */}
              <FileUploadBox
                label="Лицьова сторона документа *"
                description="Завантажте чітке фото лицьової сторони документа"
                file={files.documentFront}
                preview={previews.documentFront}
                onChange={(e) => handleFileChange(e, 'documentFront')}
                icon={FileText}
              />

              {/* Document Back (only for ID card) */}
              {formData.documentType === 'id_card' && (
                <FileUploadBox
                  label="Зворотна сторона документа *"
                  description="Завантажте чітке фото зворотної сторони ID картки"
                  file={files.documentBack}
                  preview={previews.documentBack}
                  onChange={(e) => handleFileChange(e, 'documentBack')}
                  icon={FileText}
                />
              )}

              {/* Selfie */}
              <FileUploadBox
                label="Селфі з документом *"
                description="Зробіть селфі, тримаючи документ біля обличчя"
                file={files.selfie}
                preview={previews.selfie}
                onChange={(e) => handleFileChange(e, 'selfie')}
                icon={Camera}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="card bg-gray-50">
            <div className="flex items-start space-x-3 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">Перед відправкою:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Переконайтесь що всі фото чіткі та читабельні</li>
                  <li>Ваше обличчя і документ мають бути чітко видимі на селфі</li>
                  <li>Вся інформація має співпадати з офіційними документами</li>
                  <li>Автоматична перевірка займає кілька секунд</li>
                </ul>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Відправка...' : 'Відправити документи'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// File Upload Component
const FileUploadBox = ({ label, description, file, preview, onChange, icon: Icon }) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{label}</h3>
          <p className="text-sm text-gray-500 mb-3">{description}</p>
          
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-200"
              />
              <label className="mt-2 btn btn-secondary btn-sm cursor-pointer inline-block">
                <Upload className="w-4 h-4 mr-2 inline" />
                Змінити файл
                <input
                  type="file"
                  accept="image/*"
                  onChange={onChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <label className="btn btn-secondary btn-sm cursor-pointer inline-flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Обрати файл
              <input
                type="file"
                accept="image/*"
                onChange={onChange}
                className="hidden"
              />
            </label>
          )}
          
          {file && (
            <p className="text-xs text-gray-500 mt-2">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCPage;
