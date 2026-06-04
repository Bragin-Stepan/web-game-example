import { SceneHost } from '../scenes/SceneHost';
import { ClickSpark } from '../ui/effects/ClickSpark';
import { useAppBootstrap } from './useAppBootstrap';

export function App() {
  const bootstrapStatus = useAppBootstrap();
  const activeScene = bootstrapStatus === 'ready' ? 'game' : 'loading';

  return (
    <ClickSpark className="fixed inset-0 h-dvh w-screen" sparkColor="#fde68a" sparkRadius={22} sparkCount={9}>
      <SceneHost sceneId={activeScene} />
    </ClickSpark>
  );
}
