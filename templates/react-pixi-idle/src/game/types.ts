export type ResourceId = 'energy';

export type TemplateGameState = {
  version: number;
  time: {
    totalMs: number;
    lastSaveAt: number;
  };
  resources: Record<ResourceId, number>;
  productionPerSecond: number;
  unlockedNodes: Record<string, boolean>;
};
