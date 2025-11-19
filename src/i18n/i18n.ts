import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDector from 'i18next-browser-languagedetector';
import fr from './fr.json';
import en from './en.json';

i18n.use(LanguageDector).use(initReactI18next).init({
  debug: false,
  fallbackLng: 'en',
  resources: {
    en,
    fr,
  },
});

export default i18n;
