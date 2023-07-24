import i18next from 'i18next';

export const LANGS = {
  VI: 'vi',
  EN: 'en',
};

export const getCurrentLanguage = () => {
  const currentLanguage = i18next.language || window.localStorage.i18nextLng;
  if (currentLanguage) {
    // if language = vn => convert to vi
    if (currentLanguage === 'vn') {
      return LANGS.VI;
    }
    return currentLanguage;
  } else {
    return LANGS.VI;
  }
};
