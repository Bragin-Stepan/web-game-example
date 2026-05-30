export type PlatformLanguageCode = 'ru' | 'en';

export type PlatformPauseReason = 'sdk' | 'page';

export type PlatformLifecycleHandlers = {
  onPause?: (reason: PlatformPauseReason) => void;
  onResume?: (reason: PlatformPauseReason) => void;
  onExit?: () => void | Promise<void>;
};

export type RewardedAdResult =
  | { status: 'rewarded' }
  | { status: 'closed' }
  | { status: 'unavailable'; reason?: string }
  | { status: 'error'; error: unknown };

export type InterstitialAdResult =
  | { status: 'shown' }
  | { status: 'closed'; wasShown: boolean }
  | { status: 'unavailable'; reason?: string }
  | { status: 'error'; error: unknown };

export type PlatformStorage = {
  loadProgress<T>(): Promise<T | null>;
  saveProgress<T>(progress: T, options?: { flush?: boolean }): Promise<void>;
};

export type PlatformAds = {
  showInterstitial(): Promise<InterstitialAdResult>;
  showRewarded(): Promise<RewardedAdResult>;
};

export type PlatformService = {
  readonly id: string;
  init(): Promise<void>;
  destroy?(): void;
  getLanguage(): PlatformLanguageCode;
  storage: PlatformStorage;
  ads: PlatformAds;
  lifecycle: {
    subscribe(handlers: PlatformLifecycleHandlers): () => void;
    notifyReady(): void;
    setGameplayActive(active: boolean): void;
  };
};
