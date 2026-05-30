import { bootstrapGamePlatform } from '@core-inc/yandex-game-kit';
import { AudioManager } from '../audio/AudioManager';
import { useTemplateStore } from '../game/GameStore';
import type { TemplateGameState } from '../game/types';
import { createTemplateProgressSave, restoreTemplateProgressSave } from './gameProgress';

export async function bootstrapPlatform() {
  await bootstrapGamePlatform<TemplateGameState, ReturnType<typeof createTemplateProgressSave>>({
    getGameState: () => useTemplateStore.getState().gameState,
    setGameState: (state) => useTemplateStore.getState().setGameState(state),
    serializeSave: createTemplateProgressSave,
    restoreSave: restoreTemplateProgressSave,
    setLanguage: (language) => useTemplateStore.getState().setLanguage(language),
    setFocusPaused: (paused) => useTemplateStore.getState().updateUI({ isFocusPaused: paused }),
    pauseAudio: () => AudioManager.pauseAll(),
    resumeAudio: () => AudioManager.resumeAll().catch(() => undefined),
  });
}
