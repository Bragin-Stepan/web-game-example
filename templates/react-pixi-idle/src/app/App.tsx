import { useEffect, useRef } from 'react';
import { isPlatformAccessAllowed, installGameInputGuards } from '@core-inc/yandex-game-kit';
import { FaCog, FaShoppingCart, FaSitemap } from 'react-icons/fa';
import { AudioManager } from '../audio/AudioManager';
import { SHOP_ACCESS_RULE } from '../config/products';
import { getUIText } from '../config/text';
import { GameLoop } from '../game/GameLoop';
import { useTemplateStore } from '../game/GameStore';
import { PixiApp } from '../renderer/PixiApp';
import { ShopOverlay } from '../ui/ShopOverlay';
import { SkillTreeOverlay } from '../ui/SkillTreeOverlay';
import { IconButton } from '../ui/components/IconButton';
import { ResourceBar } from '../ui/components/ResourceBar';
import { SettingsOverlay } from '../ui/components/SettingsOverlay';

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixiRef = useRef<PixiApp | null>(null);
  const loopRef = useRef<GameLoop | null>(null);

  const energy = useTemplateStore((state) => state.gameState.resources.energy);
  const productionPerSecond = useTemplateStore((state) => state.gameState.productionPerSecond);
  const isPaused = useTemplateStore((state) => state.ui.isPaused || state.ui.isFocusPaused);
  const isSettingsOpen = useTemplateStore((state) => state.ui.isSettingsOpen);
  const audio = useTemplateStore((state) => state.ui.audio);
  const language = useTemplateStore((state) => state.ui.language);
  const toggleSkillTree = useTemplateStore((state) => state.toggleSkillTree);
  const toggleSettings = useTemplateStore((state) => state.toggleSettings);
  const toggleShop = useTemplateStore((state) => state.toggleShop);
  const updateUI = useTemplateStore((state) => state.updateUI);
  const updateAudioSettings = useTemplateStore((state) => state.updateAudioSettings);
  const setLanguage = useTemplateStore((state) => state.setLanguage);
  const text = getUIText(language);
  const showShop = isPlatformAccessAllowed(SHOP_ACCESS_RULE, { devMode: import.meta.env.DEV });

  useEffect(() => installGameInputGuards(), []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    AudioManager.configure({ musicPlaylist: [], sounds: {} });
    AudioManager.setMusicVolume(useTemplateStore.getState().ui.audio.musicVolume);
    AudioManager.setSoundVolume(useTemplateStore.getState().ui.audio.soundVolume);

    const resumeAudioFromGesture = () => {
      void AudioManager.resumeAll().catch(() => undefined);
      window.removeEventListener('pointerdown', resumeAudioFromGesture);
      window.removeEventListener('keydown', resumeAudioFromGesture);
    };

    const syncFocusPause = () => {
      const paused = document.hidden || !document.hasFocus();
      updateUI({ isFocusPaused: paused });
      if (paused) {
        AudioManager.pauseAll();
      }
    };

    window.addEventListener('pointerdown', resumeAudioFromGesture);
    window.addEventListener('keydown', resumeAudioFromGesture);
    document.addEventListener('visibilitychange', syncFocusPause);
    window.addEventListener('blur', syncFocusPause);
    window.addEventListener('focus', syncFocusPause);
    syncFocusPause();

    return () => {
      window.removeEventListener('pointerdown', resumeAudioFromGesture);
      window.removeEventListener('keydown', resumeAudioFromGesture);
      document.removeEventListener('visibilitychange', syncFocusPause);
      window.removeEventListener('blur', syncFocusPause);
      window.removeEventListener('focus', syncFocusPause);
    };
  }, [updateUI]);

  useEffect(() => {
    AudioManager.setMusicVolume(audio.musicVolume);
    AudioManager.setSoundVolume(audio.soundVolume);
  }, [audio.musicVolume, audio.soundVolume]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mounted = true;
    const pixi = new PixiApp();

    pixi.init(window.innerWidth, window.innerHeight, {
      onPrimaryClick: () => {
        useTemplateStore.getState().toggleSkillTree();
      },
    }).then(() => {
      if (!mounted) {
        pixi.destroy();
        return;
      }

      container.appendChild(pixi.app.canvas);
      pixiRef.current = pixi;

      const loop = new GameLoop();
      loopRef.current = loop;
      loop.start(() => pixi.update(useTemplateStore.getState().gameState));
    });

    const handleResize = () => {
      pixiRef.current?.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      loopRef.current?.stop();
      loopRef.current = null;
      pixiRef.current?.destroy();
      pixiRef.current = null;
    };
  }, []);

  return (
    <main id="game-root" className="fixed inset-0 h-dvh w-screen">
      <div ref={containerRef} className="fixed inset-0 h-dvh w-screen" />

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
        <ResourceBar
          items={[
            { id: 'energy', label: 'Energy', value: Math.floor(energy), accent: '#38bdf8' },
            { id: 'rate', label: 'Rate', value: `${productionPerSecond.toFixed(1)}/s`, accent: '#2dd4bf' },
          ]}
        />
      </section>

      {isPaused ? <div className="fixed left-4 top-[74px] z-10 grid min-h-10 place-items-center px-3.5 font-black text-amber-500">Paused</div> : null}
      <SkillTreeOverlay />
      {showShop ? <ShopOverlay /> : null}
      {isSettingsOpen ? (
        <SettingsOverlay
          language={language}
          musicVolume={audio.musicVolume}
          soundVolume={audio.soundVolume}
          onLanguageChange={setLanguage}
          onMusicVolumeChange={(musicVolume) => updateAudioSettings({ musicVolume })}
          onSoundVolumeChange={(soundVolume) => updateAudioSettings({ soundVolume })}
          onClose={toggleSettings}
        />
      ) : null}
    </main>
  );
}
