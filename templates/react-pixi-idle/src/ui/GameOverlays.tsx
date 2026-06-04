import { useTemplateStore } from '../game/GameStore';
import { ShopOverlay } from './ShopOverlay';
import { SkillTreeOverlay } from './SkillTreeOverlay';
import { SettingsOverlay } from './components/SettingsOverlay';

export type GameOverlaysProps = {
  showShop: boolean;
};

export function GameOverlays({ showShop }: GameOverlaysProps) {
  const isSettingsOpen = useTemplateStore((state) => state.ui.isSettingsOpen);
  const audio = useTemplateStore((state) => state.ui.audio);
  const language = useTemplateStore((state) => state.ui.language);
  const toggleSettings = useTemplateStore((state) => state.toggleSettings);
  const updateAudioSettings = useTemplateStore((state) => state.updateAudioSettings);
  const setLanguage = useTemplateStore((state) => state.setLanguage);

  return (
    <>
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
    </>
  );
}
