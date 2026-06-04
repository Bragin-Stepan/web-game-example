import { BrowserPlatformService } from './providers/BrowserPlatformService';
import { YandexPlatformService } from './providers/YandexPlatformService';
import type { PlatformService } from './types';
import type { PlatformFeature, PlatformId } from './types';

let platformService: PlatformService | null = null;

export type PlatformAccessRule = {
  platforms?: readonly PlatformId[];
  allowDevMode?: boolean;
};

export async function initializePlatformService(): Promise<PlatformService> {
  if (platformService) return platformService;

  const service = typeof YaGames !== 'undefined'
    ? await initWithFallback(new YandexPlatformService())
    : await initWithFallback(new BrowserPlatformService());

  platformService = service;
  return service;
}

export function getPlatformService(): PlatformService {
  if (!platformService) {
    platformService = new BrowserPlatformService();
    void platformService.init();
  }
  return platformService;
}

export function getPlatformId(): PlatformId {
  return getPlatformService().id;
}

export function isPlatform(platformId: PlatformId): boolean {
  return getPlatformService().is(platformId);
}

export function supportsPlatformFeature(feature: PlatformFeature): boolean {
  return getPlatformService().supports(feature);
}

export function isPlatformAccessAllowed(
  rule: PlatformAccessRule,
  options: { devMode?: boolean } = {},
): boolean {
  if (rule.allowDevMode && options.devMode) return true;
  if (!rule.platforms || rule.platforms.length === 0) return true;
  return rule.platforms.some((platformId) => isPlatform(platformId));
}

export function setPlatformServiceForTesting(service: PlatformService | null): void {
  platformService?.destroy?.();
  platformService = service;
}

async function initWithFallback(service: PlatformService): Promise<PlatformService> {
  try {
    await service.init();
    return service;
  } catch (error) {
    console.warn(`Platform "${service.id}" failed to initialize, using browser fallback.`, error);
    const fallback = new BrowserPlatformService();
    await fallback.init();
    return fallback;
  }
}
