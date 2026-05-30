import {
  configureInterstitialAdController,
  initializeInterstitialAdCooldown,
} from '../ads/InterstitialAdController';
import { initializePlatformService } from './Platform';
import type { PlatformPauseReason, PlatformService } from './types';

const DEFAULT_AUTOSAVE_INTERVAL_MS = 15_000;

let autosaveTimer: number | null = null;
let unsubscribeLifecycle: (() => void) | null = null;
let isSaving = false;
let saveRequestedWhileSaving = false;
let pendingSaveNeedsFlush = false;

export type GamePlatformBootstrapOptions<TGameState, TSave> = {
  autosaveIntervalMs?: number;
  getGameState(): TGameState;
  setGameState(state: TGameState): void;
  serializeSave(state: TGameState): TSave;
  restoreSave(save: unknown): TGameState | null;
  setLanguage(language: ReturnType<PlatformService['getLanguage']>): void;
  setFocusPaused(paused: boolean, reason: PlatformPauseReason): void;
  pauseAudio?(): void;
  resumeAudio?(): void | Promise<void>;
};

export async function bootstrapGamePlatform<TGameState, TSave>(
  options: GamePlatformBootstrapOptions<TGameState, TSave>,
) {
  const platform = await initializePlatformService();

  configureInterstitialAdController({
    onBeforeAd: () => {
      platform.lifecycle.setGameplayActive(false);
      options.setFocusPaused(true, 'sdk');
      options.pauseAudio?.();
    },
    onAfterAd: () => {
      options.setFocusPaused(false, 'sdk');
      platform.lifecycle.setGameplayActive(true);
      void options.resumeAudio?.();
      void saveCurrentProgress(platform, options, true);
    },
  });
  initializeInterstitialAdCooldown();
  options.setLanguage(platform.getLanguage());

  const savedProgress = await platform.storage.loadProgress();
  const restoredState = options.restoreSave(savedProgress);
  if (restoredState) {
    options.setGameState(restoredState);
  }

  installPlatformLifecycle(platform, options);
  platform.lifecycle.notifyReady();
  platform.lifecycle.setGameplayActive(true);
}

function installPlatformLifecycle<TGameState, TSave>(
  platform: PlatformService,
  options: GamePlatformBootstrapOptions<TGameState, TSave>,
) {
  unsubscribeLifecycle?.();
  unsubscribeLifecycle = platform.lifecycle.subscribe({
    onPause: (reason) => {
      platform.lifecycle.setGameplayActive(false);
      options.setFocusPaused(true, reason);
      options.pauseAudio?.();
      void saveCurrentProgress(platform, options, true);
    },
    onResume: (reason) => {
      options.setFocusPaused(false, reason);
      platform.lifecycle.setGameplayActive(true);
      void options.resumeAudio?.();
    },
    onExit: () => saveCurrentProgress(platform, options, true),
  });

  if (autosaveTimer !== null) {
    window.clearInterval(autosaveTimer);
  }
  autosaveTimer = window.setInterval(() => {
    void saveCurrentProgress(platform, options, false);
  }, options.autosaveIntervalMs ?? DEFAULT_AUTOSAVE_INTERVAL_MS);
}

async function saveCurrentProgress<TGameState, TSave>(
  platform: PlatformService,
  options: GamePlatformBootstrapOptions<TGameState, TSave>,
  flush: boolean,
) {
  if (isSaving) {
    saveRequestedWhileSaving = true;
    pendingSaveNeedsFlush = pendingSaveNeedsFlush || flush;
    return;
  }

  isSaving = true;
  try {
    const save = options.serializeSave(options.getGameState());
    await platform.storage.saveProgress(save, { flush });
  } finally {
    isSaving = false;
  }

  if (saveRequestedWhileSaving) {
    const shouldFlush = pendingSaveNeedsFlush || flush;
    saveRequestedWhileSaving = false;
    pendingSaveNeedsFlush = false;
    await saveCurrentProgress(platform, options, shouldFlush);
  }
}
