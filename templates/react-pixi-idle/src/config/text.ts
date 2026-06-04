import type { PlatformLanguageCode } from '@core-inc/yandex-game-kit';

export type TemplateUIText = {
  close: string;
  settings: string;
  shop: string;
  skills: string;
  language: string;
  previousLanguage: string;
  nextLanguage: string;
  sounds: string;
  music: string;
  buy: string;
  owned: string;
  purchasePending: string;
  purchaseUnavailable: string;
  shopUnavailable: string;
};

export const UI_TEXT: Record<PlatformLanguageCode, TemplateUIText> = {
  ru: {
    close: 'Закрыть',
    settings: 'Настройки',
    shop: 'Магазин',
    skills: 'Навыки',
    language: 'Язык',
    previousLanguage: 'Предыдущий язык',
    nextLanguage: 'Следующий язык',
    sounds: 'Звуки',
    music: 'Музыка',
    buy: 'Купить',
    owned: 'Куплено',
    purchasePending: 'Покупка',
    purchaseUnavailable: 'Покупка сейчас недоступна',
    shopUnavailable: 'Магазин недоступен на этой платформе',
  },
  en: {
    close: 'Close',
    settings: 'Settings',
    shop: 'Shop',
    skills: 'Skills',
    language: 'Language',
    previousLanguage: 'Previous language',
    nextLanguage: 'Next language',
    sounds: 'Sounds',
    music: 'Music',
    buy: 'Buy',
    owned: 'Owned',
    purchasePending: 'Purchasing',
    purchaseUnavailable: 'Purchase is unavailable right now',
    shopUnavailable: 'Shop is unavailable on this platform',
  },
};

export function getUIText(language: PlatformLanguageCode): TemplateUIText {
  return UI_TEXT[language] ?? UI_TEXT.en;
}
