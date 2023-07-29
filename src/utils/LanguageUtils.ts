import i18next from 'i18next';

import { VI } from '../assets/i18n/i18n.config';

export const LANGS = {
  VI: 'vi',
  EN: 'en',
};

export const getCurrentLanguage = () => {
  const currentLanguage = i18next.language || window.localStorage.i18nextLng;
  if (currentLanguage) {
    // if language = vn => convert to vi
    if (currentLanguage === VI) {
      return LANGS.VI;
    }
    return currentLanguage;
  } else {
    return LANGS.VI;
  }
};
