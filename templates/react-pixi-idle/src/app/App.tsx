import { useEffect, useRef } from 'react';
import { installGameInputGuards } from '@core-inc/yandex-game-kit';
import { AudioManager } from '../audio/AudioManager';
import { GameLoop } from '../game/GameLoop';
import { useTemplateStore } from '../game/GameStore';
import { PixiApp } from '../renderer/PixiApp';
import { SkillTreeOverlay } from '../ui/SkillTreeOverlay';
import { Button } from '../ui/components/Button';
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
  const isManuallyPaused = useTemplateStore((state) => state.ui.isPaused);
  const audio = useTemplateStore((state) => state.ui.audio);
  const toggleSkillTree = useTemplateStore((state) => state.toggleSkillTree);
  const toggleSettings = useTemplateStore((state) => state.toggleSettings);
  const togglePause = useTemplateStore((state) => state.togglePause);
  const updateUI = useTemplateStore((state) => state.updateUI);
  const updateAudioSettings = useTemplateStore((state) => state.updateAudioSettings);

  useEffect(() => installGameInputGuards(), []);

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
    <main id="game-root">
      <div ref={containerRef} className="canvas-root" />

      <section className="hud">
        <ResourceBar
          items={[
            { id: 'energy', label: 'Energy', value: Math.floor(energy), accent: '#38bdf8' },
            { id: 'rate', label: 'Rate', value: `${productionPerSecond.toFixed(1)}/s`, accent: '#2dd4bf' },
          ]}
        />
        <Button type="button" variant="primary" shine onClick={toggleSkillTree}>
          Skills
        </Button>
        <IconButton label="Settings" shine onClick={toggleSettings}>
          *
        </IconButton>
      </section>

      {isPaused ? <div className="pause-pill">Paused</div> : null}
      <SkillTreeOverlay />
      {isSettingsOpen ? (
        <SettingsOverlay
          isPaused={isManuallyPaused}
          musicVolume={audio.musicVolume}
          soundVolume={audio.soundVolume}
          onTogglePause={togglePause}
          onMusicVolumeChange={(musicVolume) => updateAudioSettings({ musicVolume })}
          onSoundVolumeChange={(soundVolume) => updateAudioSettings({ soundVolume })}
          onClose={toggleSettings}
        />
      ) : null}
    </main>
  );
}
