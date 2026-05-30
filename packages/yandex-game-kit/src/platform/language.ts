import type { PlatformLanguageCode } from './types';

const SUPPORTED_LANGUAGES = new Set<PlatformLanguageCode>(['ru', 'en']);

export function normalizePlatformLanguage(language: string | null | undefined): PlatformLanguageCode {
  const normalized = language?.toLowerCase().split(/[-_]/)[0] as PlatformLanguageCode | undefined;
  return normalized && SUPPORTED_LANGUAGES.has(normalized) ? normalized : 'en';
}
