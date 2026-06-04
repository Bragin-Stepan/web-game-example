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
- `ConfirmDialog`: confirmation popup.
- `ResourceBar`: compact HUD resource chips.
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

`SettingsOverlay` demonstrates controlled range inputs:

```tsx
<SettingsOverlay
  language={language}
  musicVolume={audio.musicVolume}
  soundVolume={audio.soundVolume}
  onLanguageChange={setLanguage}
  onMusicVolumeChange={(musicVolume) => updateAudioSettings({ musicVolume })}
  onSoundVolumeChange={(soundVolume) => updateAudioSettings({ soundVolume })}
/>
```

The template stores these values in `GameStore` UI state and persists them to `localStorage`
under the key from `src/config/settings.ts`.
