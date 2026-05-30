# UI Guide

Shared UI components live in:

```text
src/ui/components/
src/ui/styles/theme.css
```

## Components

- `Button`: primary/secondary/ghost/danger button with optional shine.
- `IconButton`: square icon button with accessible label.
- `Overlay`: reusable popup/panel shell.
- `ConfirmDialog`: confirmation popup.
- `ResourceBar`: compact HUD resource chips.
- `SettingsOverlay`: example settings popup.
- slider rows for settings such as music and sound volume.

## Shine Animation

Any component can opt into the sweep highlight with:

```tsx
<Button shine>Buy</Button>
```

Or directly:

```tsx
<div className="ui-shine">...</div>
```

The animation is defined in `src/ui/styles/theme.css` as `ui-shine-sweep`.

## Theme

Change colors and panel feel through CSS variables in `:root`:

```css
:root {
  --ui-bg: #0f172a;
  --ui-panel: #111827;
  --ui-accent: #38bdf8;
}
```

Prefer changing variables and shared components before styling one-off overlays.

## Settings Sliders

`SettingsOverlay` demonstrates controlled range inputs:

```tsx
<SettingsOverlay
  musicVolume={audio.musicVolume}
  soundVolume={audio.soundVolume}
  onMusicVolumeChange={(musicVolume) => updateAudioSettings({ musicVolume })}
  onSoundVolumeChange={(soundVolume) => updateAudioSettings({ soundVolume })}
/>
```

The template stores these values in `GameStore` UI state and persists them to `localStorage`.
