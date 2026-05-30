export type WebAudioAsset = {
  id?: string;
  key?: string;
  src: string;
  volume?: number;
};

export type WebAudioConfig = {
  musicPlaylist: WebAudioAsset[];
  sounds: Record<string, WebAudioAsset>;
};

export type WebAudioManagerOptions = {
  defaultMusicVolume?: number;
  defaultSoundVolume?: number;
  resolveSrc?: (src: string) => string;
};

export const DEFAULT_MUSIC_VOLUME = 0.25;
export const DEFAULT_SOUND_VOLUME = 0.4;

/**
 * Web Audio based playback keeps game music out of browser media notification UI.
 */
export class WebAudioManager {
  private config: WebAudioConfig = { musicPlaylist: [], sounds: {} };
  private musicVolume: number;
  private soundVolume: number;
  private currentTrackIndex = 0;
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private soundGain: GainNode | null = null;
  private currentMusicSource: AudioBufferSourceNode | null = null;
  private currentMusicTrackId: string | null = null;
  private musicStartedAt = 0;
  private musicPausedAt = 0;
  private isMusicPlaying = false;
  private wasMusicPlayingBeforePause = false;
  private bufferCache = new Map<string, Promise<AudioBuffer>>();
  private resolveSource: (src: string) => string;

  constructor(options: WebAudioManagerOptions = {}) {
    this.musicVolume = options.defaultMusicVolume ?? DEFAULT_MUSIC_VOLUME;
    this.soundVolume = options.defaultSoundVolume ?? DEFAULT_SOUND_VOLUME;
    this.resolveSource = options.resolveSrc ?? ((src) => new URL(src, window.location.href).href);
  }

  configure(config: WebAudioConfig) {
    this.config = config;
    this.currentTrackIndex = 0;
    this.stopMusic();
    this.bufferCache.clear();
  }

  registerMusic(tracks: WebAudioAsset[]) {
    this.configure({
      ...this.config,
      musicPlaylist: tracks,
    });
  }

  registerSound(key: string, sound: WebAudioAsset) {
    this.config = {
      ...this.config,
      sounds: {
        ...this.config.sounds,
        [key]: sound,
      },
    };
  }

  registerSounds(sounds: Record<string, WebAudioAsset>) {
    this.config = {
      ...this.config,
      sounds: {
        ...this.config.sounds,
        ...sounds,
      },
    };
  }

  setMusicVolume(volume: number) {
    this.musicVolume = this.normalizeVolume(volume);
    this.applyCategoryVolumes();
  }

  setSoundVolume(volume: number) {
    this.soundVolume = this.normalizeVolume(volume);
    this.applyCategoryVolumes();
  }

  getMusicVolume() {
    return this.musicVolume;
  }

  getSoundVolume() {
    return this.soundVolume;
  }

  async playMusic() {
    const track = this.config.musicPlaylist[this.currentTrackIndex];
    if (!track) return;

    const context = this.ensureContext();
    await this.resumeContext();

    const trackId = this.getAssetId(track);
    if (this.isMusicPlaying && this.currentMusicTrackId === trackId) return;

    const buffer = await this.loadBuffer(track);
    this.stopMusicSource();

    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = this.config.musicPlaylist.length <= 1;
    gain.gain.value = this.normalizeVolume(track.volume ?? 1);
    source.connect(gain);
    gain.connect(this.musicGain!);
    source.addEventListener('ended', () => {
      if (this.currentMusicSource !== source) return;
      this.currentMusicSource = null;
      this.currentMusicTrackId = null;
      this.musicPausedAt = 0;
      this.isMusicPlaying = false;
      if (!source.loop) {
        this.playNextTrack();
      }
    });

    const offset = Math.min(this.musicPausedAt, Math.max(0, buffer.duration - 0.01));
    this.musicStartedAt = context.currentTime - offset;
    this.musicPausedAt = 0;
    this.currentMusicSource = source;
    this.currentMusicTrackId = trackId;
    this.isMusicPlaying = true;
    source.start(0, offset);
  }

  pauseMusic() {
    if (!this.currentMusicSource || !this.audioContext) return;
    this.musicPausedAt = Math.max(0, this.audioContext.currentTime - this.musicStartedAt);
    this.isMusicPlaying = false;
    this.stopMusicSource();
  }

  stopMusic() {
    this.musicPausedAt = 0;
    this.isMusicPlaying = false;
    this.stopMusicSource();
  }

  pauseAll() {
    this.wasMusicPlayingBeforePause = this.wasMusicPlayingBeforePause || this.isMusicPlaying || this.musicPausedAt > 0;
    this.pauseMusic();
    if (this.audioContext?.state === 'running') {
      void this.audioContext.suspend().catch(() => undefined);
    }
  }

  async resumeAll() {
    const shouldResumeMusic = this.wasMusicPlayingBeforePause || this.musicPausedAt > 0;
    if (!this.audioContext && !shouldResumeMusic) return;

    await this.resumeContext();
    if (shouldResumeMusic) {
      this.wasMusicPlayingBeforePause = false;
      await this.playMusic();
    }
  }

  playSound(key: string) {
    const sound = this.config.sounds[key];
    if (!sound) return;

    void this.playSoundAsync(key, sound).catch((error) => {
      console.warn(`Unable to play sound "${key}".`, error);
    });
  }

  private async playSoundAsync(key: string, sound: WebAudioAsset) {
    void key;
    const context = this.ensureContext();
    await this.resumeContext();
    const buffer = await this.loadBuffer(sound);
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = this.normalizeVolume(sound.volume ?? 1);
    source.connect(gain);
    gain.connect(this.soundGain!);
    source.start();
  }

  private playNextTrack = () => {
    if (this.config.musicPlaylist.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.config.musicPlaylist.length;
    void this.playMusic().catch(() => undefined);
  };

  private ensureContext() {
    if (this.audioContext) return this.audioContext;

    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContextCtor();
    const masterGain = context.createGain();
    const musicGain = context.createGain();
    const soundGain = context.createGain();

    musicGain.connect(masterGain);
    soundGain.connect(masterGain);
    masterGain.connect(context.destination);

    this.audioContext = context;
    this.masterGain = masterGain;
    this.musicGain = musicGain;
    this.soundGain = soundGain;
    this.applyCategoryVolumes();

    return context;
  }

  private async resumeContext() {
    const context = this.ensureContext();
    if (context.state === 'suspended') {
      await context.resume();
    }
  }

  private async loadBuffer(config: WebAudioAsset) {
    const src = this.resolveSource(config.src);
    const cached = this.bufferCache.get(src);
    if (cached) return cached;

    const bufferPromise = fetch(src)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load audio: ${src}`);
        }
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => this.ensureContext().decodeAudioData(arrayBuffer.slice(0)));

    this.bufferCache.set(src, bufferPromise);
    return bufferPromise;
  }

  private stopMusicSource() {
    if (!this.currentMusicSource) return;

    const source = this.currentMusicSource;
    this.currentMusicSource = null;
    this.currentMusicTrackId = null;
    try {
      source.stop();
    } catch {
      // Source may already be stopped by the browser.
    }
  }

  private applyCategoryVolumes() {
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume;
    }
    if (this.soundGain) {
      this.soundGain.gain.value = this.soundVolume;
    }
    if (this.masterGain) {
      this.masterGain.gain.value = 1;
    }
  }

  private normalizeVolume(volume: number) {
    return Math.max(0, Math.min(1, volume));
  }

  private getAssetId(asset: WebAudioAsset) {
    return asset.id ?? asset.key ?? asset.src;
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
