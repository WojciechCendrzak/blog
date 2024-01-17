import { en } from './locales/en';
import i18next from 'i18next';
import { getTranslationKeys } from 'i18n-keys';

i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: en,
    },
  },
});

export const translate = (key: string) => i18next.t(key).toString();

export const translationKeys = getTranslationKeys(en);
