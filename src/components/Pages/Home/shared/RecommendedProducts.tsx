'use client';

import { Product } from '@shopify/hydrogen-react/storefront-api-types';
import ProductTile from '../../Products/shared/ProductTile';
import { LocaleLanguages } from '@/i18n/utils';

interface RecommendedProductsProps {
  locale: LocaleLanguages;
  products: Product[];
}

export default function RecommendedProducts({ locale, products }: RecommendedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="flex w-full items-center justify-center">
      <div
        className="w-11/12 max-w-7xl overflow-auto sm:overflow-hidden p-2 py-8 scrollbar-hide snap-x snap-mandator"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
        }}
      >
        <div className="flex w-max sm:animate-scroll-infinite hover:[animation-play-state:paused]">
          {[...products, ...products].map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="w-60 flex-shrink-0 px-2 xs:w-80 snap-center"
            >
              <ProductTile product={product} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}