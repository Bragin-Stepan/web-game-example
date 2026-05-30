import { create } from 'zustand';
import { loadDefaultContentPack } from '../content/ContentLoader';
import type { TemplateContentPack, ProgressionNodeConfig } from '../content/schemas/ContentTypes';
import type { TemplateGameState } from './types';

const AUDIO_SETTINGS_STORAGE_KEY = 'react-pixi-idle-template.audio';

export type AudioSettings = {
  musicVolume: number;
  soundVolume: number;
};

export type TemplateUIState = {
  isPaused: boolean;
  isFocusPaused: boolean;
  isSkillTreeOpen: boolean;
  isSettingsOpen: boolean;
  audio: AudioSettings;
  language: 'en' | 'ru';
};

export type TemplateStoreState = {
  gameState: TemplateGameState;
  content: TemplateContentPack;
  ui: TemplateUIState;
  setGameState: (state: TemplateGameState) => void;
  step: (deltaMs: number) => void;
  buyNode: (nodeId: string) => void;
  updateUI: (partial: Partial<TemplateUIState>) => void;
  updateAudioSettings: (partial: Partial<AudioSettings>) => void;
  setLanguage: (language: TemplateUIState['language']) => void;
  togglePause: () => void;
  toggleSkillTree: () => void;
  toggleSettings: () => void;
};

export function createInitialGameState(): TemplateGameState {
  return {
    version: 1,
    time: {
      totalMs: 0,
      lastSaveAt: Date.now(),
    },
    resources: {
      energy: 25,
    },
    productionPerSecond: 0.5,
    unlockedNodes: {},
  };
}

const content = loadDefaultContentPack();

function normalizeVolume(volume: number) {
  return Math.max(0, Math.min(1, volume));
}

function loadAudioSettings(): AudioSettings {
  if (typeof window === 'undefined') {
    return {
      musicVolume: 0.25,
      soundVolume: 0.4,
    };
  }

  try {
    const raw = window.localStorage.getItem(AUDIO_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return {
        musicVolume: 0.25,
        soundVolume: 0.4,
      };
    }
    const parsed = JSON.parse(raw) as Partial<AudioSettings>;
    return {
      musicVolume: normalizeVolume(parsed.musicVolume ?? 0.25),
      soundVolume: normalizeVolume(parsed.soundVolume ?? 0.4),
    };
  } catch {
    return {
      musicVolume: 0.25,
      soundVolume: 0.4,
    };
  }
}

function saveAudioSettings(settings: AudioSettings) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export const useTemplateStore = create<TemplateStoreState>((set, get) => ({
  gameState: createInitialGameState(),
  content,
  ui: {
    isPaused: false,
    isFocusPaused: false,
    isSkillTreeOpen: false,
    isSettingsOpen: false,
    audio: loadAudioSettings(),
    language: 'en',
  },

  setGameState: (state) => set({ gameState: state }),

  step: (deltaMs) => {
    const { gameState, ui } = get();
    if (ui.isPaused || ui.isFocusPaused) return;

    const gainedEnergy = gameState.productionPerSecond * (deltaMs / 1000);
    set({
      gameState: {
        ...gameState,
        time: {
          ...gameState.time,
          totalMs: gameState.time.totalMs + deltaMs,
        },
        resources: {
          ...gameState.resources,
          energy: gameState.resources.energy + gainedEnergy,
        },
      },
    });
  },

  buyNode: (nodeId) => {
    const { gameState, content } = get();
    if (gameState.unlockedNodes[nodeId]) return;

    const node = content.progressionNodes.find((candidate: ProgressionNodeConfig) => candidate.id === nodeId);
    if (!node) return;
    const energyCost = node.cost.energy ?? 0;
    if (gameState.resources.energy < energyCost) return;
    if (!node.parentIds.every((parentId) => gameState.unlockedNodes[parentId])) return;

    set({
      gameState: {
        ...gameState,
        resources: {
          ...gameState.resources,
          energy: gameState.resources.energy - energyCost,
        },
        productionPerSecond: gameState.productionPerSecond + (node.rewards.productionPerSecond ?? 0),
        unlockedNodes: {
          ...gameState.unlockedNodes,
          [nodeId]: true,
        },
      },
    });
  },

  updateUI: (partial) => {
    const { ui } = get();
    set({ ui: { ...ui, ...partial } });
  },

  updateAudioSettings: (partial) => {
    const { ui } = get();
    const audio = {
      ...ui.audio,
      ...partial,
    };
    audio.musicVolume = normalizeVolume(audio.musicVolume);
    audio.soundVolume = normalizeVolume(audio.soundVolume);
    saveAudioSettings(audio);
    set({ ui: { ...ui, audio } });
  },

  setLanguage: (language) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    get().updateUI({ language });
  },

  togglePause: () => {
    const { ui } = get();
    set({ ui: { ...ui, isPaused: !ui.isPaused } });
  },

  toggleSkillTree: () => {
    const { ui } = get();
    set({ ui: { ...ui, isSkillTreeOpen: !ui.isSkillTreeOpen } });
  },

  toggleSettings: () => {
    const { ui } = get();
    set({ ui: { ...ui, isSettingsOpen: !ui.isSettingsOpen } });
  },
}));
