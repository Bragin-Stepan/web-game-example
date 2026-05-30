import type { Player, SDK } from 'ysdk';
import { normalizePlatformLanguage } from '../language';
import type {
  InterstitialAdResult,
  PlatformLifecycleHandlers,
  PlatformService,
  RewardedAdResult,
} from '../types';

const PROGRESS_KEY = 'progress';

export class YandexPlatformService implements PlatformService {
  readonly id = 'yandex';

  private sdk: SDK | null = null;
  private player: Player | null = null;
  private handlers = new Set<PlatformLifecycleHandlers>();
  private unsubscribers: Array<() => void> = [];

  storage = {
    loadProgress: async <T>(): Promise<T | null> => {
      const player = await this.getPlayer();
      const data = await player.getData([PROGRESS_KEY] as const);
      return (data[PROGRESS_KEY] as T | undefined) ?? null;
    },

    saveProgress: async <T>(progress: T, options?: { flush?: boolean }): Promise<void> => {
      const player = await this.getPlayer();
      await player.setData({ [PROGRESS_KEY]: progress }, options?.flush ?? false);
    },
  };

  ads = {
    showInterstitial: () => this.showInterstitial(),
    showRewarded: () => this.showRewarded(),
  };

  lifecycle = {
    subscribe: (handlers: PlatformLifecycleHandlers) => {
      this.handlers.add(handlers);
      return () => this.handlers.delete(handlers);
    },
    notifyReady: () => {
      try {
        this.sdk?.features.LoadingAPI.ready();
      } catch (error) {
        console.warn('Unable to notify Yandex LoadingAPI readiness.', error);
      }
    },
    setGameplayActive: (active: boolean) => {
      try {
        if (active) {
          this.sdk?.features.GameplayAPI.start();
        } else {
          this.sdk?.features.GameplayAPI.stop();
        }
      } catch (error) {
        console.warn(`Unable to ${active ? 'start' : 'stop'} Yandex gameplay.`, error);
      }
    },
  };

  async init() {
    this.sdk = await YaGames.init();
    this.player = await this.sdk.getPlayer().catch(() => null);
    this.unsubscribers.push(
      this.sdk.on('game_api_pause', () => {
        this.handlers.forEach((handler) => handler.onPause?.('sdk'));
      }),
      this.sdk.on('game_api_resume', () => {
        this.handlers.forEach((handler) => handler.onResume?.('sdk'));
      }),
      this.sdk.onEvent(this.sdk.EVENTS.EXIT, () => {
        this.handlers.forEach((handler) => {
          void handler.onExit?.();
        });
      }),
    );
    window.addEventListener('pagehide', this.handlePageExit);
    window.addEventListener('beforeunload', this.handlePageExit);
  }

  getLanguage() {
    return normalizePlatformLanguage(
      this.sdk?.environment.i18n.lang ?? this.sdk?.environment.browser.lang,
    );
  }

  destroy() {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];
    window.removeEventListener('pagehide', this.handlePageExit);
    window.removeEventListener('beforeunload', this.handlePageExit);
  }

  private async getPlayer() {
    if (this.player) return this.player;
    if (!this.sdk) throw new Error('Yandex SDK is not initialized');
    this.player = await this.sdk.getPlayer();
    return this.player;
  }

  private showInterstitial(): Promise<InterstitialAdResult> {
    if (!this.sdk) return Promise.resolve({ status: 'unavailable', reason: 'sdk_not_ready' });
    return new Promise((resolve) => {
      this.sdk?.adv.showFullscreenAdv({
        callbacks: {
          onOpen: () => undefined,
          onClose: (wasShown) => resolve({ status: 'closed', wasShown }),
          onOffline: () => resolve({ status: 'unavailable', reason: 'offline' }),
          onError: (error) => resolve({ status: 'error', error }),
        },
      });
    });
  }

  private showRewarded(): Promise<RewardedAdResult> {
    if (!this.sdk) return Promise.resolve({ status: 'unavailable', reason: 'sdk_not_ready' });
    return new Promise((resolve) => {
      let rewarded = false;
      this.sdk?.adv.showRewardedVideo({
        callbacks: {
          onRewarded: () => {
            rewarded = true;
          },
          onClose: () => resolve(rewarded ? { status: 'rewarded' } : { status: 'closed' }),
          onError: (error) => resolve({ status: 'error', error }),
        },
      });
    });
  }

  private handlePageExit = () => {
    this.handlers.forEach((handler) => {
      void handler.onExit?.();
    });
  };
}
