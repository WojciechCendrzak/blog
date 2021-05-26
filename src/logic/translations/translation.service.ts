import { en } from './locales/en';
import i18next, { TFunction } from 'i18next';
import { getTranslationKeys } from 'i18n-keys';

i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: en,
    },
  },
});

export const translate: TFunction = (key: string) => i18next.t(key);

export const translationKeys = getTranslationKeys(en);
