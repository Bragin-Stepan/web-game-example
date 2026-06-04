# Platform Config

Platform-specific behavior is configured in app code, not inside reusable packages.

## Products

Product keys live in:

```text
src/config/products.ts
```

Use `PRODUCT_KEYS` for stable app-owned ids:

```ts
export const PRODUCT_KEYS = {
  disableAds: 'disable_ads',
} as const;
```

The value must match the product id configured in the Yandex Games catalog.

## Shop Visibility

`SHOP_ACCESS_RULE` controls where the shop button is visible:

```ts
export const SHOP_ACCESS_RULE = {
  platforms: [PlatformId.Yandex],
  allowDevMode: true,
};
```

Use `isPlatformAccessAllowed(rule, { devMode })` for any future platform-gated UI.

## Purchase Hooks

Each `ShopProductConfig` can define purchase event hooks:

```ts
events: {
  onPurchased: async ({ product, result }) => {
    // Apply or track product-specific behavior.
  },
  onAlreadyOwned: async ({ product }) => {
    // Optional restore or analytics hook.
  },
}
```

Keep game-specific effects here or in app-owned adapters. Do not move product ids or
game rewards into `@core-inc/yandex-game-kit`.

## Browser Fallback

Local browser development uses `BrowserPlatformService`.

- purchases are stored in `localStorage` under `core-inc.platform-purchases`;
- progress is stored under `core-inc.platform-progress`;
- ads are reported as unavailable.

This makes shop flows testable without the Yandex SDK.

## Settings

Language and audio defaults live in:

```text
src/config/settings.ts
```

Template UI labels live in:

```text
src/config/text.ts
```

When creating a new game, change the settings storage key so projects do not share
local browser settings.

## Verification

Run:

```bash
npm run smoke
npm run audit:yandex
```

From the workspace root:

```bash
npm run smoke:template
npm run audit:yandex
```
