import type { PlatformLanguageCode } from '@core-inc/yandex-game-kit';

export const TEMPLATE_SETTINGS_STORAGE_KEY = 'react-pixi-idle-template.settings';

export const DEFAULT_AUDIO_SETTINGS = {
  soundVolume: 0.6,
  musicVolume: 0,
} as const;

export type TemplateLanguageOption = {
  id: PlatformLanguageCode;
  label: string;
};

export const LANGUAGE_OPTIONS: readonly TemplateLanguageOption[] = [
  { id: 'ru', label: 'Русский' },
  { id: 'en', label: 'English' },
];

export const DEFAULT_LANGUAGE: PlatformLanguageCode = 'en';
