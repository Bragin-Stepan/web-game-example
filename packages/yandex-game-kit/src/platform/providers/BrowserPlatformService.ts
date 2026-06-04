import { normalizePlatformLanguage } from '../language';
import { PlatformFeature, PlatformId } from '../types';
import type {
  InterstitialAdResult,
  PlatformLifecycleHandlers,
  PlatformProduct,
  PlatformService,
  RewardedAdResult,
} from '../types';

const BROWSER_PROGRESS_KEY = 'core-inc.platform-progress';
const BROWSER_PURCHASES_KEY = 'core-inc.platform-purchases';

export class BrowserPlatformService implements PlatformService {
  readonly id = PlatformId.Browser;
  readonly capabilities = {
    [PlatformFeature.Ads]: false,
    [PlatformFeature.Commerce]: true,
    [PlatformFeature.CloudProgress]: false,
    [PlatformFeature.GameplayLifecycle]: false,
  };

  private handlers = new Set<PlatformLifecycleHandlers>();

  storage = {
    loadProgress: async <T>(): Promise<T | null> => {
      try {
        const raw = window.localStorage.getItem(BROWSER_PROGRESS_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as T;
      } catch (error) {
        console.warn('Unable to load browser progress, starting from a clean state.', error);
        return null;
      }
    },

    saveProgress: async <T>(progress: T | null): Promise<void> => {
      try {
        if (progress === null) {
          window.localStorage.removeItem(BROWSER_PROGRESS_KEY);
          return;
        }
        window.localStorage.setItem(BROWSER_PROGRESS_KEY, JSON.stringify(progress));
      } catch (error) {
        console.warn('Unable to save browser progress.', error);
      }
    },
  };

  ads = {
    showInterstitial: async (): Promise<InterstitialAdResult> => ({ status: 'unavailable', reason: 'browser' }),
    showRewarded: async (): Promise<RewardedAdResult> => ({ status: 'unavailable', reason: 'browser' }),
  };

  commerce = {
    getProducts: async (): Promise<PlatformProduct[]> => [],
    hasPurchase: async (productId: string): Promise<boolean> => this.getPurchases().includes(productId),
    purchase: async (productId: string) => {
      const purchases = this.getPurchases();
      if (purchases.includes(productId)) {
        return { status: 'already-owned' as const };
      }
      window.localStorage.setItem(BROWSER_PURCHASES_KEY, JSON.stringify([...purchases, productId]));
      return { status: 'purchased' as const };
    },
  };

  lifecycle = {
    subscribe: (handlers: PlatformLifecycleHandlers) => {
      this.handlers.add(handlers);
      return () => this.handlers.delete(handlers);
    },
    notifyReady: () => undefined,
    setGameplayActive: () => undefined,
  };

  is(platformId: PlatformId) {
    return this.id === platformId;
  }

  supports(feature: PlatformFeature) {
    return this.capabilities[feature];
  }

  async init() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleBlur);
    window.addEventListener('focus', this.handleFocus);
    window.addEventListener('pagehide', this.handleExit);
    window.addEventListener('beforeunload', this.handleExit);
  }

  destroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleBlur);
    window.removeEventListener('focus', this.handleFocus);
    window.removeEventListener('pagehide', this.handleExit);
    window.removeEventListener('beforeunload', this.handleExit);
  }

  getLanguage() {
    return normalizePlatformLanguage(navigator.language);
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.handlers.forEach((handler) => handler.onPause?.('page'));
    } else {
      this.handlers.forEach((handler) => handler.onResume?.('page'));
    }
  };

  private handleBlur = () => {
    this.handlers.forEach((handler) => handler.onPause?.('page'));
  };

  private handleFocus = () => {
    if (!document.hidden) {
      this.handlers.forEach((handler) => handler.onResume?.('page'));
    }
  };

  private handleExit = () => {
    this.handlers.forEach((handler) => {
      void handler.onExit?.();
    });
  };

  private getPurchases() {
    try {
      const raw = window.localStorage.getItem(BROWSER_PURCHASES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [];
    } catch {
      return [];
    }
  }
}
