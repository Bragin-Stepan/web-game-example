import { useMemo } from 'react';
import { FaCog, FaShoppingCart, FaSitemap } from 'react-icons/fa';
import { getUIText } from '../config/text';
import { useTemplateStore } from '../game/GameStore';
import { IconButton } from './components/IconButton';
import { ResourceBar } from './components/ResourceBar';

export type GameHudProps = {
  showShop: boolean;
};

export function GameHud({ showShop }: GameHudProps) {
  const energy = useTemplateStore((state) => Math.floor(state.gameState.resources.energy));
  const productionPerSecond = useTemplateStore((state) => state.gameState.productionPerSecond);
  const isPaused = useTemplateStore((state) => state.ui.isPaused || state.ui.isFocusPaused);
  const language = useTemplateStore((state) => state.ui.language);
  const toggleSkillTree = useTemplateStore((state) => state.toggleSkillTree);
  const toggleSettings = useTemplateStore((state) => state.toggleSettings);
  const toggleShop = useTemplateStore((state) => state.toggleShop);
  const text = getUIText(language);
  const resourceItems = useMemo(() => [
    { id: 'energy', label: 'Energy', value: energy, accent: '#38bdf8' },
    { id: 'rate', label: 'Rate', value: `${productionPerSecond.toFixed(1)}/s`, accent: '#2dd4bf' },
  ], [energy, productionPerSecond]);

  return (
    <>
      <section className="fixed left-4 top-4 z-10 flex max-w-[calc(100vw-2rem)] items-center gap-4 max-[620px]:left-3 max-[620px]:right-3 max-[620px]:flex-wrap">
        <IconButton label={text.skills} variant="plain" tooltipPlacement="bottom" onClick={toggleSkillTree}>
          <FaSitemap />
        </IconButton>
        {showShop ? (
          <IconButton label={text.shop} variant="plain" tooltipPlacement="bottom" onClick={toggleShop}>
            <FaShoppingCart />
          </IconButton>
        ) : null}
        <IconButton label={text.settings} variant="plain" tooltipPlacement="bottom" onClick={toggleSettings}>
          <FaCog />
        </IconButton>
        <ResourceBar items={resourceItems} />
      </section>

      {isPaused ? (
        <div className="fixed left-4 top-[74px] z-10 grid min-h-10 place-items-center px-3.5 font-black text-amber-500">
          Paused
        </div>
      ) : null}
    </>
  );
}
