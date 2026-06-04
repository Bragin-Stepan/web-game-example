import { bootstrapGamePlatform, getPlatformService } from '@core-inc/yandex-game-kit';
import { AudioManager } from '../audio/AudioManager';
import { PRODUCT_KEYS } from '../config/products';
import { TEMPLATE_SETTINGS_STORAGE_KEY } from '../config/settings';
import { useTemplateStore } from '../game/GameStore';
import type { TemplateGameState } from '../game/types';
import { createTemplateProgressSave, restoreTemplateProgressSave } from './gameProgress';

export async function bootstrapPlatform() {
  await bootstrapGamePlatform<TemplateGameState, ReturnType<typeof createTemplateProgressSave>>({
    getGameState: () => useTemplateStore.getState().gameState,
    setGameState: (state) => useTemplateStore.getState().setGameState(state),
    serializeSave: createTemplateProgressSave,
    restoreSave: restoreTemplateProgressSave,
    canShowInterstitialAd: async () => !(await getPlatformService().commerce.hasPurchase(PRODUCT_KEYS.disableAds)),
    setLanguage: (language) => {
      if (!hasStoredLanguagePreference()) {
        useTemplateStore.getState().setLanguage(language);
      }
    },
    setFocusPaused: (paused) => useTemplateStore.getState().updateUI({ isFocusPaused: paused }),
    pauseAudio: () => AudioManager.pauseAll(),
    resumeAudio: () => AudioManager.resumeAll().catch(() => undefined),
  });
}

function hasStoredLanguagePreference() {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(TEMPLATE_SETTINGS_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { language?: unknown };
    return typeof parsed.language === 'string';
  } catch {
    return false;
  }
}
