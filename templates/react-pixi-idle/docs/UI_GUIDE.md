# UI Guide

Shared UI components live in:

```text
src/ui/components/
src/ui/components/uiPrimitives.ts
src/ui/lib/cn.ts
```

## Components

- `Button`: primary/secondary/ghost/danger button with optional shine.
- `IconButton`: square icon button with accessible label and tooltip.
- `Tooltip`: small hover/focus tooltip used by icon controls.
- `Overlay`: reusable popup/panel shell with a dark header and light body.
- `ElasticSlider`: springy controlled slider for settings.
- `ConfirmDialog`: confirmation popup.
- `ResourceBar`: compact HUD resource chips.
- `ClickSpark`: global click/tap spark effect layer.
- `SettingsOverlay`: example settings popup.
- `ShopOverlay`: config-driven purchase popup example.
- slider rows for settings such as language, music, and sound volume.

## Shine Animation

Buttons can opt into a Tailwind-powered sweep highlight with:

```tsx
<Button shine>Buy</Button>
```

## Theme

Change colors and panel feel in the shared components first:

```tsx
<section className="rounded-xl border border-black/30 bg-neutral-100 shadow-2xl" />
```

Prefer Tailwind utilities in reusable components over adding global CSS.

For reusable variants, edit `src/ui/components/uiPrimitives.ts` instead of
duplicating long Tailwind class strings across components.

## Platform UI

Shop visibility is controlled by `SHOP_ACCESS_RULE` in `src/config/products.ts`.
Use `isPlatformAccessAllowed()` from `@core-inc/yandex-game-kit` for other
platform-specific buttons or overlays.

## Settings Sliders

`SettingsOverlay` uses the shared `ElasticSlider` component for music and sound.
Keep future sliders controlled by store state and expose an accessible label:

```tsx
<ElasticSlider
  ariaLabel={text.sounds}
  min={0}
  max={1}
  step={0.01}
  value={soundVolume}
  onChange={onSoundVolumeChange}
/>
```

The template stores these values in `GameStore` UI state and persists them to `localStorage`
under the key from `src/config/settings.ts`.

## UI Effects

`App` wraps the active scene in `ClickSpark`, so pointer taps work across the
canvas, HUD, and popups. Keep the effect global unless a game needs scene-specific
feedback rules.
