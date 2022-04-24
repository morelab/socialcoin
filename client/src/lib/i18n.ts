import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../assets/locales/en.json';
import es from '../assets/locales/es.json';
import eus from '../assets/locales/eus.json';

const resources = {
  en,
  es,
  eus
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
  });

export default i18n;