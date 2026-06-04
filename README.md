# Web Game Template Workspace

Reusable browser game starter for PixiJS + React games, with Yandex Games platform support.

## Layout

```text
packages/
  yandex-game-kit/      platform, saves, ads, audio, input guards
  progression-tree/     reusable React progression tree primitives
templates/
  react-pixi-idle/      starter app for a new Pixi + React idle game
docs/
  AI_RELEASE_CHECKLIST.md
  TEMPLATE_PREP.md
```

There is no bundled example game. The template is intentionally small so a new project starts from generic code, not from a reskinned finished game.

## Commands

```bash
npm install
npm run dev
npm run validate:content
npm run smoke:template
npm run build
npm run lint
npm run audit:yandex
npm run typecheck:kit
```

`npm run dev` starts `templates/react-pixi-idle`.

## What The Template Includes

- Vite, React, TypeScript, Zustand, PixiJS.
- Fullscreen game root and Pixi canvas.
- Fixed-step game loop.
- App-owned save serializer and restore function.
- Yandex/browser platform bootstrap through `@core-inc/yandex-game-kit`.
- WebAudio manager wrapper.
- Input and viewport guards.
- Small progression tree using `@core-inc/progression-tree`.
- Commerce/purchase contract with a configurable remove-ads shop example.
- Platform access rules for showing features such as shop only on selected platforms.
- Reusable popup, tooltip, settings, and shop UI style.
- Template smoke test for HUD, settings, shop, language switching, and browser purchase fallback.
- Yandex release audit script.

## Starting A New Project

Use the generator for a standalone project:

```bash
npm run create-game -- ../my-web-game
```

Optional generator flags:

```bash
npm run create-game -- ../my-web-game --name "My Web Game" --product-prefix my-game --storage-prefix my-game
```

Then replace app-owned files:

- `src/content/packs/default/content.json`
- `src/config/products.ts`
- `src/config/settings.ts`
- `src/config/text.ts`
- `src/game/GameStore.ts`
- `src/game/types.ts`
- `src/renderer/PixiApp.ts`
- `src/renderer/layers/*`
- `src/ui/SkillTreeOverlay.tsx`
- `src/index.css`

Keep the platform adapter shape in `src/platform/bootstrap.ts` unless the game needs a different save format or lifecycle policy.

More detailed usage is in [templates/react-pixi-idle/README.md](templates/react-pixi-idle/README.md).
