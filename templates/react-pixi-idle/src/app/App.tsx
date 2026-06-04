import { SceneHost } from '../scenes/SceneHost';
import { useAppBootstrap } from './useAppBootstrap';

export function App() {
  const bootstrapStatus = useAppBootstrap();
  const activeScene = bootstrapStatus === 'ready' ? 'game' : 'loading';

  return <SceneHost sceneId={activeScene} />;
}
