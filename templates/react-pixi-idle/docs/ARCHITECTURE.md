# Architecture

The template has three boundaries.

## App Code

Owns game-specific behavior:

- `src/game`: state, commands, simulation.
- `src/content`: content pack loading and schemas.
- `src/renderer`: Pixi scene and input.
- `src/ui`: React screens and shared UI components.
- `src/platform`: save format and platform adapter.

Change these freely for a new game.

## Shared Packages

Use these as infrastructure, not as game-code dumping grounds:

- `@core-inc/yandex-game-kit`: platform lifecycle, storage, ads, WebAudio, input guards.
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

