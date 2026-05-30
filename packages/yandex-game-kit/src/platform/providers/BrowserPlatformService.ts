import { normalizePlatformLanguage } from '../language';
import type {
  InterstitialAdResult,
  PlatformLifecycleHandlers,
  PlatformService,
  RewardedAdResult,
} from '../types';

const BROWSER_PROGRESS_KEY = 'core-inc.platform-progress';

export class BrowserPlatformService implements PlatformService {
  readonly id = 'browser';

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

    saveProgress: async <T>(progress: T): Promise<void> => {
      try {
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

  lifecycle = {
    subscribe: (handlers: PlatformLifecycleHandlers) => {
      this.handlers.add(handlers);
      return () => this.handlers.delete(handlers);
    },
    notifyReady: () => undefined,
    setGameplayActive: () => undefined,
  };

  async init() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('pagehide', this.handleExit);
    window.addEventListener('beforeunload', this.handleExit);
  }

  destroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
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

  private handleExit = () => {
    this.handlers.forEach((handler) => {
      void handler.onExit?.();
    });
  };
}
