# @core-inc/yandex-game-kit

Framework-agnostic helpers for Yandex Games WebApps.

The package intentionally does not depend on React, Zustand, Pixi, Phaser, or a specific game state shape. Games provide adapters for state, saves, pause/resume, and audio.

## Exports

- `PlatformService` contract.
- Yandex and browser platform providers.
- `initializePlatformService()` / `getPlatformService()`.
- `bootstrapGamePlatform(options)`.
- Interstitial ad cooldown/controller helpers.
- Platform capabilities, platform access helpers, and commerce contract.
- Web Audio manager that avoids browser media notification UI.
- `installGameInputGuards()`.
- `normalizePlatformLanguage()`.

## Example

```ts
import { bootstrapGamePlatform } from '@core-inc/yandex-game-kit';

await bootstrapGamePlatform({
  getGameState,
  setGameState,
  serializeSave,
  restoreSave,
  setLanguage,
  setFocusPaused,
  pauseAudio,
  resumeAudio,
});
```

```ts
import { WebAudioManager } from '@core-inc/yandex-game-kit';

const audio = new WebAudioManager({
  resolveSrc: (src) => new URL(src, window.location.href).href,
});

audio.configure({
  musicPlaylist: [{ id: 'main', src: '/music.ogg', volume: 0.6 }],
  sounds: {
    click: { key: 'click', src: '/click.wav', volume: 0.8 },
  },
});
```

```ts
import { PlatformId, getPlatformService, isPlatformAccessAllowed } from '@core-inc/yandex-game-kit';

const showShop = isPlatformAccessAllowed({
  platforms: [PlatformId.Yandex],
  allowDevMode: true,
}, { devMode: import.meta.env.DEV });

const owned = await getPlatformService().commerce.hasPurchase('disable_ads');
```
