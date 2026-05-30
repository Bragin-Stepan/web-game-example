import { BrowserPlatformService } from './providers/BrowserPlatformService';
import { YandexPlatformService } from './providers/YandexPlatformService';
import type { PlatformService } from './types';

let platformService: PlatformService | null = null;

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
