import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vn from './lang/vn.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vn',
    lng: 'vn',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      vn: {
        translation: vn,
      },
    },
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'b', 'i'],
    },
  });

i18n.languages = ['vn'];

export default i18n;
