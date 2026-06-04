import { isPlatformAccessAllowed } from '@core-inc/yandex-game-kit';
import { SHOP_ACCESS_RULE } from '../config/products';
import { useTemplateStore } from '../game/GameStore';
import { PixiCanvasHost } from '../renderer/PixiCanvasHost';
import { GameHud } from '../ui/GameHud';
import { GameOverlays } from '../ui/GameOverlays';
import { useAudioLifecycle } from '../app/useAudioLifecycle';
import { useDocumentLanguage } from '../app/useDocumentLanguage';
import { useGameInputGuards } from '../app/useGameInputGuards';

export function GameScene() {
  const audio = useTemplateStore((state) => state.ui.audio);
  const language = useTemplateStore((state) => state.ui.language);
  const updateUI = useTemplateStore((state) => state.updateUI);
  const showShop = isPlatformAccessAllowed(SHOP_ACCESS_RULE, { devMode: import.meta.env.DEV });

  useGameInputGuards();
  useDocumentLanguage(language);
  useAudioLifecycle(audio, updateUI);

  return (
    <main id="game-root" data-scene="game" className="fixed inset-0 h-dvh w-screen">
      <PixiCanvasHost />
      <GameHud showShop={showShop} />
      <GameOverlays showShop={showShop} />
    </main>
  );
}
