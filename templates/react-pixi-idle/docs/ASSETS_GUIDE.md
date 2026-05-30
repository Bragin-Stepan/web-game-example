# Assets Guide

Use this layout:

```text
src/assets/
  sprites/
  audio/music/
  audio/sound/
  fonts/
```

## Audio

`src/audio/AudioManager.ts` resolves bundled audio with `import.meta.glob`.

Supported default extensions:

```text
mp3, ogg, wav, m4a
```

Do not use `<audio>`, `<video>`, `new Audio()`, or Media Session metadata for game music. Use the WebAudio manager through the app adapter.

## Sprites

For Pixi, keep asset loading app-owned. A common pattern is:

```ts
const SPRITES = import.meta.glob('../assets/sprites/**/*.{png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
```

Reference assets from content by stable paths or semantic ids, then resolve them in the app layer.

