# New Game Guide

## Preferred Flow

From the template workspace:

```bash
npm run create-game -- ../my-web-game
cd ../my-web-game
npm install
npm run dev
npm run smoke
```

The generated project includes local copies of `packages/yandex-game-kit` and `packages/progression-tree`, so it can run outside this workspace.

Use generator flags to avoid shared localStorage keys and placeholder product ids:

```bash
npm run create-game -- ../my-web-game --name "My Web Game" --product-prefix my-game --storage-prefix my-game
```

This rewrites:

- `index.html` title and description;
- `package.json` package name;
- `src/config/settings.ts` storage key;
- `src/config/products.ts` remove-ads product id.

## Manual Flow

Copy `templates/react-pixi-idle`, then copy the root `packages` directory into the copied project. In the copied app `package.json`, use:

```json
{
  "dependencies": {
    "@core-inc/yandex-game-kit": "file:packages/yandex-game-kit",
    "@core-inc/progression-tree": "file:packages/progression-tree"
  }
}
```

## First Files To Change

1. `package.json`: package name.
2. `index.html`: title, description, language.
3. `src/content/packs/default/content.json`: resources and progression.
4. `src/game/types.ts`: game state types.
5. `src/game/GameStore.ts`: commands and simulation.
6. `src/scenes/*`: loading, menu, game, and other top-level screens.
7. `src/renderer/PixiApp.ts`: Pixi composition.
8. `src/renderer/layers/*`: visual layers.
9. `src/ui/*`: HUD, overlays, settings.

## Keep Initially

Keep these until the project has a clear reason to diverge:

- `src/platform/bootstrap.ts`
- `src/platform/gameProgress.ts`
- `src/audio/AudioManager.ts`
- `scripts/audit-yandex-game.mjs`
- `scripts/smoke-template.mjs`
- `scripts/validate-content.mjs`
