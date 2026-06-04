import { useEffect } from 'react';
import type { PlatformLanguageCode } from '@core-inc/yandex-game-kit';

export function useDocumentLanguage(language: PlatformLanguageCode) {
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
}
