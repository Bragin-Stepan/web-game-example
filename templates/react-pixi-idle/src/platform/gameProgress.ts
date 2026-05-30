import { createInitialGameState } from '../game/GameStore';
import type { TemplateGameState } from '../game/types';

const SAVE_VERSION = 1;

export type TemplateProgressSave = {
  version: number;
  savedAt: number;
  gameState: TemplateGameState;
};

export function createTemplateProgressSave(state: TemplateGameState): TemplateProgressSave {
  return {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    gameState: {
      ...state,
      time: {
        ...state.time,
        lastSaveAt: Date.now(),
      },
    },
  };
}

export function restoreTemplateProgressSave(save: unknown): TemplateGameState | null {
  if (!isObject(save) || save.version !== SAVE_VERSION || !isObject(save.gameState)) {
    return null;
  }

  const base = createInitialGameState();
  const gameState = save.gameState as Partial<TemplateGameState>;

  return {
    ...base,
    ...gameState,
    time: {
      ...base.time,
      ...gameState.time,
    },
    resources: {
      ...base.resources,
      ...gameState.resources,
    },
    unlockedNodes: {
      ...base.unlockedNodes,
      ...gameState.unlockedNodes,
    },
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
