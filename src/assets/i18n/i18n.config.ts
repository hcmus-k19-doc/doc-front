import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import en from './lang/en.json';
import vn from './lang/vn.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vn',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      vn: {
        translation: vn,
      },
      en: {
        translation: en,
      },
    },
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'b', 'i'],
      useSuspense: false,
    },
    detection: {
      order: ['queryString', 'cookie'],
      caches: ['cookie'],
    },
  })
  .catch((err) => console.error(err));

i18n.languages = ['vn', 'en'];

export default i18n;
