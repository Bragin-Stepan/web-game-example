import { useEffect } from 'react';
import { AudioManager } from '../audio/AudioManager';
import type { AudioSettings, TemplateUIState } from '../game/GameStore';

type UpdateUI = (partial: Partial<TemplateUIState>) => void;

export function useAudioLifecycle(audio: AudioSettings, updateUI: UpdateUI) {
  useEffect(() => {
    AudioManager.configure({ musicPlaylist: [], sounds: {} });

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
}
