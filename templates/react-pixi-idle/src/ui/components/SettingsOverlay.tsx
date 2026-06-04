import type { CSSProperties, ReactNode } from 'react';
import type { PlatformLanguageCode } from '@core-inc/yandex-game-kit';
import { FaChevronLeft, FaChevronRight, FaMusic, FaVolumeUp } from 'react-icons/fa';
import { LANGUAGE_OPTIONS } from '../../config/settings';
import { getUIText } from '../../config/text';
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
          icon={<FaVolumeUp />}
          label={text.sounds}
          value={soundVolume}
          onChange={onSoundVolumeChange}
        />
        <VolumeSlider
          icon={<FaMusic />}
          label={text.music}
          value={musicVolume}
          onChange={onMusicVolumeChange}
        />
      </div>
    </Overlay>
  );
}

function VolumeSlider({
  icon,
  label,
  value,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  onChange: (volume: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between gap-3">
        <strong className="inline-flex items-center gap-2 text-sm font-black text-neutral-600">
          {icon}
          {label}
        </strong>
        <em className="text-sm not-italic tabular-nums font-black text-neutral-500">{Math.round(value * 100)}%</em>
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(value * 100)}
        className={[
          'h-2 w-full cursor-pointer appearance-none rounded-full',
          'bg-[linear-gradient(90deg,#171717_0,#171717_var(--range-progress),#d0d0d0_var(--range-progress),#d0d0d0_100%)]',
          '[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent',
          '[&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2',
          '[&::-webkit-slider-thumb]:border-slate-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm',
          '[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-neutral-300',
          '[&::-moz-range-progress]:h-2 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-neutral-950',
          '[&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:rounded-full',
          '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-300 [&::-moz-range-thumb]:bg-white',
        ].join(' ')}
        style={{ '--range-progress': `${Math.round(value * 100)}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.currentTarget.value) / 100)}
      />
    </label>
  );
}
