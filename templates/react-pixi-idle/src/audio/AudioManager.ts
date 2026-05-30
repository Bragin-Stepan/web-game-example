import { WebAudioManager } from '@core-inc/yandex-game-kit';

const AUDIO_ASSETS = import.meta.glob('../assets/audio/**/*.{mp3,ogg,wav,m4a}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function resolveBundledAudioSrc(src: string) {
  const normalizedSrc = src.replace(/^\/+/, '').replace(/^src\//, '');
  const bundledAsset = AUDIO_ASSETS[`../${normalizedSrc}`];
  if (bundledAsset) return new URL(bundledAsset, window.location.href).href;
  return new URL(src, window.location.href).href;
}

export const AudioManager = new WebAudioManager({
  resolveSrc: resolveBundledAudioSrc,
});
