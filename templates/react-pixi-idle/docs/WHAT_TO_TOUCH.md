# What To Change And What To Keep

## Change For Every Game

- `src/content/packs/default/content.json`
- `src/config/products.ts`
- `src/config/settings.ts`
- `src/config/text.ts`
- `src/game/types.ts`
- `src/game/GameStore.ts`
- `src/renderer/layers/*`
- `src/ui/*`
- `src/index.css`
- `index.html`
- `public/favicon.svg`

## Often Adjust Per Game

- shop product list and platform access rules in `src/config/products.ts`;
- language list, audio defaults, and settings storage key in `src/config/settings.ts`;
- shared UI labels in `src/config/text.ts`;
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
- commerce and purchase adapters;
- platform feature/access helpers;
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
