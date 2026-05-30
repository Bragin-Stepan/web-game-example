import { getPlatformService } from '../platform/Platform';

const DEFAULT_INITIAL_INTERSTITIAL_COOLDOWN_MS = 2 * 60 * 1000;
const DEFAULT_REPEAT_INTERSTITIAL_COOLDOWN_MS = 60 * 1000;

export type InterstitialAdControllerOptions = {
  initialCooldownMs?: number;
  repeatCooldownMs?: number;
  onBeforeAd?: (reason: string) => void;
  onAfterAd?: (reason: string) => void | Promise<void>;
};

let nextAllowedAt = Number.POSITIVE_INFINITY;
let isInitialized = false;
let isShowing = false;
let initialCooldownMs = DEFAULT_INITIAL_INTERSTITIAL_COOLDOWN_MS;
let repeatCooldownMs = DEFAULT_REPEAT_INTERSTITIAL_COOLDOWN_MS;
let onBeforeAd: InterstitialAdControllerOptions['onBeforeAd'];
let onAfterAd: InterstitialAdControllerOptions['onAfterAd'];

export function configureInterstitialAdController(options: InterstitialAdControllerOptions) {
  initialCooldownMs = options.initialCooldownMs ?? initialCooldownMs;
  repeatCooldownMs = options.repeatCooldownMs ?? repeatCooldownMs;
  onBeforeAd = options.onBeforeAd ?? onBeforeAd;
  onAfterAd = options.onAfterAd ?? onAfterAd;
}

export function initializeInterstitialAdCooldown(now = Date.now()) {
  if (isInitialized) return;
  isInitialized = true;
  nextAllowedAt = now + initialCooldownMs;
}

export function requestInterstitialAd(reason: string): boolean {
  if (!isInitialized) {
    initializeInterstitialAdCooldown();
  }

  const now = Date.now();
  if (isShowing || now < nextAllowedAt) {
    return false;
  }

  isShowing = true;
  nextAllowedAt = now + repeatCooldownMs;
  onBeforeAd?.(reason);

  void getPlatformService().ads.showInterstitial()
    .catch((error) => {
      console.warn(`Interstitial ad "${reason}" failed.`, error);
    })
    .finally(() => {
      isShowing = false;
      void onAfterAd?.(reason);
    });

  return true;
}
