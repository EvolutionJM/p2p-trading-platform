import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import uk from './locales/uk.json';
import ru from './locales/ru.json';
import es from './locales/es.json';
import zh from './locales/zh.json';

const resources = {
  en: { translation: en },
  uk: { translation: uk },
  ru: { translation: ru },
  es: { translation: es },
  zh: { translation: zh },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
