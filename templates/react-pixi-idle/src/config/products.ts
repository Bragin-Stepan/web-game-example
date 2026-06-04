import {
  PlatformId,
  type PlatformAccessRule,
  type PlatformLanguageCode,
  type PlatformProduct,
  type PlatformPurchaseResult,
} from '@core-inc/yandex-game-kit';

export const PRODUCT_KEYS = {
  disableAds: 'disable_ads',
} as const;

export type TemplateProductKey = keyof typeof PRODUCT_KEYS;

export type ShopProductConfig = {
  key: TemplateProductKey;
  productId: string;
  title: Record<PlatformLanguageCode, string>;
  description: Record<PlatformLanguageCode, string>;
  fallbackPrice: string;
  events?: ShopProductEvents;
};

export type ShopPurchaseEventContext = {
  product: ShopProductConfig;
  platformProduct?: PlatformProduct;
  result: Extract<PlatformPurchaseResult, { status: 'purchased' | 'already-owned' }>;
};

export type ShopProductEvents = {
  onPurchased?: (context: ShopPurchaseEventContext) => void | Promise<void>;
  onAlreadyOwned?: (context: ShopPurchaseEventContext) => void | Promise<void>;
};

export const SHOP_ACCESS_RULE: PlatformAccessRule = {
  platforms: [PlatformId.Yandex],
  allowDevMode: true,
};

export const SHOP_PRODUCTS: readonly ShopProductConfig[] = [
  {
    key: 'disableAds',
    productId: PRODUCT_KEYS.disableAds,
    title: {
      ru: 'Отключить рекламу',
      en: 'Disable ads',
    },
    description: {
      ru: 'Скрывает полноэкранную рекламу.',
      en: 'Hides fullscreen interstitial ads.',
    },
    fallbackPrice: '',
  },
];

export function getConfiguredShopProduct(productId: string) {
  return SHOP_PRODUCTS.find((product) => product.productId === productId) ?? null;
}

export function mergePlatformProduct(config: ShopProductConfig, platformProduct?: PlatformProduct) {
  return {
    id: config.productId,
    title: platformProduct?.title,
    description: platformProduct?.description,
    imageURI: platformProduct?.imageURI,
    price: platformProduct?.price ?? config.fallbackPrice,
  } satisfies PlatformProduct;
}

export async function dispatchShopPurchaseEvent(context: ShopPurchaseEventContext) {
  if (context.result.status === 'purchased') {
    await context.product.events?.onPurchased?.(context);
    return;
  }

  await context.product.events?.onAlreadyOwned?.(context);
}
