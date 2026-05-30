# What To Change And What To Keep

## Change For Every Game

- `src/content/packs/default/content.json`
- `src/game/types.ts`
- `src/game/GameStore.ts`
- `src/renderer/layers/*`
- `src/ui/*`
- `src/index.css`
- `index.html`
- `public/favicon.svg`

## Often Adjust Per Game

- audio default values and storage key in `src/game/GameStore.ts`;
- settings rows in `src/ui/components/SettingsOverlay.tsx`;
- tree visibility and locked-state rules in `src/ui/SkillTreeOverlay.tsx`;

## Usually Keep

- `src/platform/bootstrap.ts`
- `src/platform/gameProgress.ts`
- `src/audio/AudioManager.ts`
- `scripts/audit-yandex-game.mjs`
- `scripts/validate-content.mjs`
- viewport/input reset CSS

## Package Code

Do not put game-specific logic in `packages`.

Good package candidates:

- platform lifecycle;
- storage adapters;
- ad wrappers;
- WebAudio primitives;
- generic graph/tree UI.

Bad package candidates:

- resources;
- enemies;
- units;
- balance formulas;
- level ids;
- localization keys;
- renderer layers for a specific game.
