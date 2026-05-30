import type { ProgressionTreeNodeLike } from '@core-inc/progression-tree';

export type ResourceConfig = {
  id: string;
  title: string;
  icon?: string;
};

export type ProgressionNodeConfig = ProgressionTreeNodeLike & {
  title: string;
  description: string;
  cost: Record<string, number>;
  rewards: {
    productionPerSecond?: number;
  };
  position: {
    x: number;
    y: number;
  };
  parentIds: string[];
};

export type TemplateContentPack = {
  id: string;
  title: string;
  resources: ResourceConfig[];
  progressionNodes: ProgressionNodeConfig[];
};
