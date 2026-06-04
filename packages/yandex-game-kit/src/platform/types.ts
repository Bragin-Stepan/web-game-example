export type PlatformLanguageCode = 'ru' | 'en';

export const PlatformId = {
  Browser: 'browser',
  Yandex: 'yandex',
} as const;

export type PlatformId = (typeof PlatformId)[keyof typeof PlatformId];

export const PlatformFeature = {
  Ads: 'ads',
  Commerce: 'commerce',
  CloudProgress: 'cloud-progress',
  GameplayLifecycle: 'gameplay-lifecycle',
} as const;

export type PlatformFeature = (typeof PlatformFeature)[keyof typeof PlatformFeature];

export type PlatformCapabilities = Readonly<Record<PlatformFeature, boolean>>;

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
  saveProgress<T>(progress: T | null, options?: { flush?: boolean }): Promise<void>;
};

export type PlatformAds = {
  showInterstitial(): Promise<InterstitialAdResult>;
  showRewarded(): Promise<RewardedAdResult>;
};

export type PlatformProduct = {
  id: string;
  title?: string;
  description?: string;
  imageURI?: string;
  price?: string;
};

export type PlatformPurchaseResult =
  | { status: 'purchased' }
  | { status: 'already-owned' }
  | { status: 'unavailable'; reason?: string }
  | { status: 'failed'; error: unknown };

export type PlatformCommerce = {
  getProducts(): Promise<PlatformProduct[]>;
  hasPurchase(productId: string): Promise<boolean>;
  purchase(productId: string): Promise<PlatformPurchaseResult>;
};

export type PlatformService = {
  readonly id: PlatformId;
  readonly capabilities: PlatformCapabilities;
  is(platformId: PlatformId): boolean;
  supports(feature: PlatformFeature): boolean;
  init(): Promise<void>;
  destroy?(): void;
  getLanguage(): PlatformLanguageCode;
  storage: PlatformStorage;
  ads: PlatformAds;
  commerce: PlatformCommerce;
  lifecycle: {
    subscribe(handlers: PlatformLifecycleHandlers): () => void;
    notifyReady(): void;
    setGameplayActive(active: boolean): void;
  };
};
