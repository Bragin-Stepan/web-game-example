import { getPlatformService } from '../platform/Platform';

const DEFAULT_INITIAL_INTERSTITIAL_COOLDOWN_MS = 2 * 60 * 1000;
const DEFAULT_REPEAT_INTERSTITIAL_COOLDOWN_MS = 60 * 1000;

export type InterstitialAdControllerOptions = {
  initialCooldownMs?: number;
  repeatCooldownMs?: number;
  canShowAd?: (reason: string) => boolean | Promise<boolean>;
  onBeforeAd?: (reason: string) => void;
  onAfterAd?: (reason: string) => void | Promise<void>;
};

let nextAllowedAt = Number.POSITIVE_INFINITY;
let isInitialized = false;
let isShowing = false;
let initialCooldownMs = DEFAULT_INITIAL_INTERSTITIAL_COOLDOWN_MS;
let repeatCooldownMs = DEFAULT_REPEAT_INTERSTITIAL_COOLDOWN_MS;
let canShowAd: InterstitialAdControllerOptions['canShowAd'];
let onBeforeAd: InterstitialAdControllerOptions['onBeforeAd'];
let onAfterAd: InterstitialAdControllerOptions['onAfterAd'];

export function configureInterstitialAdController(options: InterstitialAdControllerOptions) {
  initialCooldownMs = options.initialCooldownMs ?? initialCooldownMs;
  repeatCooldownMs = options.repeatCooldownMs ?? repeatCooldownMs;
  canShowAd = options.canShowAd ?? canShowAd;
  onBeforeAd = options.onBeforeAd ?? onBeforeAd;
  onAfterAd = options.onAfterAd ?? onAfterAd;
}

export function initializeInterstitialAdCooldown(now = Date.now()) {
  if (isInitialized) return;
  isInitialized = true;
  nextAllowedAt = now + initialCooldownMs;
}

export async function requestInterstitialAd(reason: string): Promise<boolean> {
  if (!isInitialized) {
    initializeInterstitialAdCooldown();
  }

  const now = Date.now();
  if (isShowing || now < nextAllowedAt) {
    return false;
  }

  isShowing = true;
  try {
    if (canShowAd && !(await canShowAd(reason))) {
      isShowing = false;
      return false;
    }
  } catch (error) {
    console.warn(`Interstitial ad "${reason}" availability check failed.`, error);
    isShowing = false;
    return false;
  }

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
