import { useEffect, useState } from 'react';
import { FaBan, FaCheck, FaShoppingCart } from 'react-icons/fa';
import { getPlatformService, PlatformFeature, type PlatformProduct } from '@core-inc/yandex-game-kit';
import { PRODUCT_KEYS, SHOP_PRODUCTS, dispatchShopPurchaseEvent, mergePlatformProduct } from '../config/products';
import { getUIText } from '../config/text';
import { useTemplateStore } from '../game/GameStore';
import { Overlay } from './components/Overlay';

type ShopStatus = 'idle' | 'loading' | 'purchasing' | 'owned' | 'error' | 'unavailable';

export function ShopOverlay() {
  const isOpen = useTemplateStore((state) => state.ui.isShopOpen);
  const language = useTemplateStore((state) => state.ui.language);
  const toggleShop = useTemplateStore((state) => state.toggleShop);
  const text = getUIText(language);
  const [status, setStatus] = useState<ShopStatus>('idle');
  const [platformProducts, setPlatformProducts] = useState<PlatformProduct[]>([]);

  const removeAdsConfig = SHOP_PRODUCTS.find((product) => product.key === 'disableAds') ?? SHOP_PRODUCTS[0];
  const removeAdsPlatformProduct = platformProducts.find((product) => product.id === PRODUCT_KEYS.disableAds);
  const removeAdsProduct = mergePlatformProduct(removeAdsConfig, removeAdsPlatformProduct);

  useEffect(() => {
    if (!isOpen) return;

    let disposed = false;

    const loadShop = async () => {
      setStatus('loading');
      const platform = getPlatformService();
      if (!platform.supports(PlatformFeature.Commerce)) {
        setStatus('unavailable');
        return;
      }

      const [catalog, hasRemoveAds] = await Promise.all([
        platform.commerce.getProducts(),
        platform.commerce.hasPurchase(PRODUCT_KEYS.disableAds),
      ]);

      if (disposed) return;
      setPlatformProducts(catalog);
      setStatus(hasRemoveAds ? 'owned' : 'idle');
    };

    void loadShop().catch((error) => {
      console.warn('Shop load failed.', error);
      if (!disposed) setStatus('error');
    });

    return () => {
      disposed = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isBusy = status === 'loading' || status === 'purchasing';
  const isOwned = status === 'owned';
  const isUnavailable = status === 'unavailable';

  const buyRemoveAds = async () => {
    if (isBusy || isOwned || isUnavailable) return;

    setStatus('purchasing');
    const result = await getPlatformService().commerce.purchase(PRODUCT_KEYS.disableAds);
    if (result.status === 'purchased' || result.status === 'already-owned') {
      await dispatchShopPurchaseEvent({
        product: removeAdsConfig,
        platformProduct: removeAdsPlatformProduct,
        result,
      });
      setStatus('owned');
      return;
    }

    setStatus('error');
  };

  return (
    <Overlay
      title={text.shop}
      icon={<FaShoppingCart />}
      closeLabel={text.close}
      onClose={toggleShop}
      width="min(440px, 100%)"
      height="auto"
    >
      <div className="grid w-full gap-4 p-5">
        <article className="grid gap-4 rounded-lg border-2 border-black/10 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-[56px_1fr] items-center gap-3.5">
            <span className="grid h-14 w-14 place-items-center rounded-lg bg-neutral-900 text-2xl text-white shadow-md">
              {isOwned ? <FaCheck /> : <FaBan />}
            </span>
            <div className="grid min-w-0 gap-1">
              <strong className="text-lg font-black leading-tight text-neutral-950">{removeAdsConfig.title[language]}</strong>
              <span className="text-sm font-extrabold leading-snug text-neutral-500">
                {removeAdsPlatformProduct?.description ?? removeAdsConfig.description[language]}
              </span>
            </div>
          </div>

          <button
            type="button"
            className={[
              'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-neutral-900 bg-neutral-900 px-4',
              'text-sm font-black uppercase text-white transition hover:bg-neutral-800 active:scale-[0.98]',
              'disabled:cursor-default disabled:border-black/10 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:active:scale-100',
            ].join(' ')}
            disabled={isBusy || isOwned || isUnavailable}
            onClick={buyRemoveAds}
          >
            {isBusy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
            {isOwned
              ? text.owned
              : status === 'purchasing'
                ? text.purchasePending
                : `${text.buy}${removeAdsProduct.price ? ` - ${removeAdsProduct.price}` : ''}`}
          </button>

          {status === 'error' ? <p className="m-0 text-center text-xs font-black text-rose-600">{text.purchaseUnavailable}</p> : null}
          {isUnavailable ? <p className="m-0 text-center text-xs font-black text-neutral-500">{text.shopUnavailable}</p> : null}
        </article>
      </div>
    </Overlay>
  );
}
