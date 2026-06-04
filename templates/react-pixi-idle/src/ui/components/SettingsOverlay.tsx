import type { ReactNode } from 'react';
import type { PlatformLanguageCode } from '@core-inc/yandex-game-kit';
import { FaChevronLeft, FaChevronRight, FaMusic, FaVolumeUp } from 'react-icons/fa';
import { LANGUAGE_OPTIONS } from '../../config/settings';
import { getUIText } from '../../config/text';
import { ElasticSlider } from './ElasticSlider';
import { Overlay } from './Overlay';

export type SettingsOverlayProps = {
  language: PlatformLanguageCode;
  musicVolume: number;
  soundVolume: number;
  onLanguageChange: (language: PlatformLanguageCode) => void;
  onMusicVolumeChange: (volume: number) => void;
  onSoundVolumeChange: (volume: number) => void;
  onClose: () => void;
};

export function SettingsOverlay({
  language,
  musicVolume,
  soundVolume,
  onLanguageChange,
  onMusicVolumeChange,
  onSoundVolumeChange,
  onClose,
}: SettingsOverlayProps) {
  const selectedLanguageIndex = Math.max(0, LANGUAGE_OPTIONS.findIndex((option) => option.id === language));
  const selectedLanguage = LANGUAGE_OPTIONS[selectedLanguageIndex];
  const text = getUIText(language);
  const selectRelativeLanguage = (offset: number) => {
    const nextIndex = (selectedLanguageIndex + offset + LANGUAGE_OPTIONS.length) % LANGUAGE_OPTIONS.length;
    onLanguageChange(LANGUAGE_OPTIONS[nextIndex].id);
  };

  return (
    <Overlay title={text.settings} closeLabel={text.close} onClose={onClose} width="min(420px, 100%)" height="auto">
      <div className="grid w-full gap-5 p-5">
        <div
          className="grid min-h-[50px] grid-cols-[44px_1fr_44px] items-center rounded-lg border border-black/10 bg-neutral-100"
          aria-label={text.language}
        >
          <button
            type="button"
            className="grid h-full place-items-center rounded-l-lg text-neutral-700 transition hover:bg-black/10 hover:text-neutral-950"
            aria-label={text.previousLanguage}
            onClick={() => selectRelativeLanguage(-1)}
          >
            <FaChevronLeft />
          </button>
          <strong className="truncate text-center font-black text-neutral-950">{selectedLanguage.label}</strong>
          <button
            type="button"
            className="grid h-full place-items-center rounded-r-lg text-neutral-700 transition hover:bg-black/10 hover:text-neutral-950"
            aria-label={text.nextLanguage}
            onClick={() => selectRelativeLanguage(1)}
          >
            <FaChevronRight />
          </button>
        </div>

        <VolumeSlider
          leftIcon={<FaVolumeUp />}
          label={text.sounds}
          value={soundVolume}
          onChange={onSoundVolumeChange}
        />
        <VolumeSlider
          leftIcon={<FaMusic />}
          label={text.music}
          value={musicVolume}
          onChange={onMusicVolumeChange}
        />
      </div>
    </Overlay>
  );
}

function VolumeSlider({
  leftIcon,
  label,
  value,
  onChange,
}: {
  leftIcon: ReactNode;
  label: string;
  value: number;
  onChange: (volume: number) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="flex items-center justify-between gap-3">
        <strong className="text-sm font-black text-neutral-600">{label}</strong>
        <em className="text-sm not-italic tabular-nums font-black text-neutral-500">{Math.round(value * 100)}%</em>
      </span>
      <ElasticSlider
        ariaLabel={label}
        min={0}
        max={1}
        step={0.01}
        value={value}
        leftIcon={leftIcon}
        onChange={onChange}
      />
    </div>
  );
}
