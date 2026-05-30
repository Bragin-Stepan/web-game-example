import { Button } from './Button';
import { Overlay } from './Overlay';

export type SettingsOverlayProps = {
  isPaused: boolean;
  musicVolume: number;
  soundVolume: number;
  onTogglePause: () => void;
  onMusicVolumeChange: (volume: number) => void;
  onSoundVolumeChange: (volume: number) => void;
  onClose: () => void;
};

export function SettingsOverlay({
  isPaused,
  musicVolume,
  soundVolume,
  onTogglePause,
  onMusicVolumeChange,
  onSoundVolumeChange,
  onClose,
}: SettingsOverlayProps) {
  return (
    <Overlay title="Settings" subtitle="Template controls" onClose={onClose} width="min(520px, 100%)" height="auto">
      <div className="ui-settings-list">
        <div className="ui-settings-row">
          <div>
            <strong>Simulation</strong>
            <span>Pause the fixed-step game loop.</span>
          </div>
          <Button type="button" variant={isPaused ? 'primary' : 'secondary'} shine onClick={onTogglePause}>
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>

        <label className="ui-slider-row">
          <span>
            <strong>Music</strong>
            <em>{Math.round(musicVolume * 100)}%</em>
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(musicVolume * 100)}
            onChange={(event) => onMusicVolumeChange(Number(event.currentTarget.value) / 100)}
          />
        </label>

        <label className="ui-slider-row">
          <span>
            <strong>Sounds</strong>
            <em>{Math.round(soundVolume * 100)}%</em>
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(soundVolume * 100)}
            onChange={(event) => onSoundVolumeChange(Number(event.currentTarget.value) / 100)}
          />
        </label>
      </div>
    </Overlay>
  );
}
