const MAX_RENDER_RESOLUTION = 1.5;

export function getRenderResolution() {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, MAX_RENDER_RESOLUTION);
}
