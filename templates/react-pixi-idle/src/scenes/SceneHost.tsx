import type { ComponentType } from 'react';
import { GameScene } from './GameScene';
import { LoadingScene } from './LoadingScene';
import type { SceneHostProps, SceneId } from './types';

const sceneRegistry: Record<SceneId, ComponentType> = {
  loading: LoadingScene,
  game: GameScene,
};

export function SceneHost({ sceneId }: SceneHostProps) {
  const Scene = sceneRegistry[sceneId];
  return <Scene />;
}
