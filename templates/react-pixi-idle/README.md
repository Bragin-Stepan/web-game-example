# React Pixi Idle Template

Minimal starter app for browser games built with React, PixiJS, TypeScript, Zustand, and Yandex Games platform support.

The app contains a tiny passive resource loop and a small progression tree only to demonstrate wiring. Replace the game logic, content, renderer, and UI for a real project.

## Run

From the workspace root:

```bash
npm install
npm run dev
npm run validate:content
npm run build
npm run audit:yandex
```

Or target this template explicitly:

```bash
npm run dev:template
npm run build:template
npm run audit:yandex -w @core-inc/react-pixi-idle-template
```

## Create A Standalone Game

Preferred:

```bash
npm run create-game -- ../my-web-game
```

The generator copies this template and the local `packages` directory into the new project, rewrites package dependencies to local `file:packages/...` paths, and updates the app title/package name.

Manual:

1. Copy `templates/react-pixi-idle` to a new directory.
2. Copy the root `packages` directory into that directory.
3. Set dependencies to `file:packages/yandex-game-kit` and `file:packages/progression-tree`.
4. Run `npm install`.

## File Map

```text
src/
  app/App.tsx                         React shell, Pixi mount, game loop lifecycle
  audio/AudioManager.ts               App-owned WebAudio asset resolver
  content/ContentLoader.ts            Content pack loader
  content/packs/default/content.json  Demo content pack
  content/schemas/ContentTypes.ts     Content pack types
  game/GameLoop.ts                    Fixed-step loop
  game/GameStore.ts                   Zustand state, commands, simulation step
  game/types.ts                       Game state types
  platform/bootstrap.ts               Adapter into @core-inc/yandex-game-kit
  platform/gameProgress.ts            Versioned save serializer/restore
  renderer/PixiApp.ts                 Pixi application composition
  renderer/layers/*                   Replaceable Pixi layers
  renderer/input/PointerInput.ts      Canvas pointer input adapter
  ui/components/*                     Shared popup/button/HUD components
  ui/styles/theme.css                 Central UI variables and shine animation
  ui/SkillTreeOverlay.tsx             Progression tree example UI
  index.css                           Fullscreen shell and app-specific CSS
```

```text
public/
  sdk.js                              Local dev stub; Yandex provides this in production
  favicon.svg                         Replace per project
scripts/
  audit-yandex-game.mjs               Release checks for platform, audio, viewport
  validate-content.mjs                Content id/reference/cycle validation
docs/
  *.md                                Usage and architecture guides
```

## What To Replace First

For a fast prototype, replace these files in this order:

1. `src/content/packs/default/content.json`
2. `src/game/types.ts`
3. `src/game/GameStore.ts`
4. `src/renderer/layers/*`
5. `src/ui/SkillTreeOverlay.tsx`
6. `src/index.css`

Keep `src/platform/bootstrap.ts`, `src/platform/gameProgress.ts`, `src/audio/AudioManager.ts`, `scripts/audit-yandex-game.mjs`, and `scripts/validate-content.mjs` until the game has a clear reason to diverge.

## Core Concepts

- `gameState` is gameplay data that can be saved.
- `ui` is temporary interface/lifecycle state and is not saved.
- `step(deltaMs)` advances simulation.
- React dispatches commands and reads state.
- Pixi renders state and forwards input callbacks.
- Content data is validated before release.

## Shared UI

Shared UI components live in `src/ui/components`.

Available starter components:

- `Button`
- `IconButton`
- `Overlay`
- `ConfirmDialog`
- `ResourceBar`
- `SettingsOverlay`

The reusable button shine is enabled with `shine` or the `ui-shine` class. Theme variables live in `src/ui/styles/theme.css`.

## More Docs

- [docs/NEW_GAME_GUIDE.md](docs/NEW_GAME_GUIDE.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)
- [docs/UI_GUIDE.md](docs/UI_GUIDE.md)
- [docs/ASSETS_GUIDE.md](docs/ASSETS_GUIDE.md)
- [docs/WHAT_TO_TOUCH.md](docs/WHAT_TO_TOUCH.md)
