# Architecture

The template has three boundaries.

## App Code

Owns game-specific behavior:

- `src/app`: bootstrap hooks and app-level lifecycle wiring.
- `src/scenes`: scene registry and top-level screens such as loading and game.
- `src/game`: state, commands, simulation.
- `src/content`: content pack loading and schemas.
- `src/renderer`: Pixi scene and input.
- `src/ui`: React screens and shared UI components.
- `src/platform`: save format and platform adapter.

Change these freely for a new game.

`src/app/App.tsx` should stay thin. It renders immediately, runs platform bootstrap
through `useAppBootstrap()`, and hands control to `SceneHost`. Add new screens by
adding a scene component and registering it in `src/scenes/SceneHost.tsx` instead
of branching inside `App`.

The loading scene is intentionally visual-only: a centered loading icon while
Yandex/browser platform bootstrap finishes. The game scene mounts Pixi, HUD,
overlays, input guards, language sync, and audio/focus lifecycle only after
bootstrap resolves.

## Shared Packages

Use these as infrastructure, not as game-code dumping grounds:

- `@core-inc/yandex-game-kit`: platform lifecycle, storage, ads, commerce, WebAudio, input guards.
- `@core-inc/progression-tree`: pan/zoom tree UI, dependency lines, editor helpers.

Move code into packages only when it has no game-specific resources, entities, balance, text, or visual assumptions.

## Content

Content is data, not logic. The default pack lives at:

```text
src/content/packs/default/content.json
```

The validator checks ids, resource references, missing parents, invalid numbers, and progression cycles.

```bash
npm run validate:content
```
