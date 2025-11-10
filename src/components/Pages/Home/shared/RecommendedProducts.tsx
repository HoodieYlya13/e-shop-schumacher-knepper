'use client';

import { Product } from '@shopify/hydrogen-react/storefront-api-types';
import ProductTile from '../../Products/shared/ProductTile';
import { LocaleLanguages } from '@/i18n/utils';
import clsx from "clsx";
import { useEffect, useState } from "react";

interface RecommendedProductsProps {
  locale: LocaleLanguages;
  products: Product[];
}

export default function RecommendedProducts({ locale, products }: RecommendedProductsProps) {
  const [isSmUp, setIsSmUp] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");
    setIsSmUp(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsSmUp(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  
  if (!products || products.length === 0) return null;
  
  const carouselContainerClassName = "flex w-full items-center justify-center";
  const carouselClassName = "flex w-11/12 max-w-7xl overflow-auto p-2 py-8 scrollbar-hide snap-x snap-mandatory";
  const carouselItemClassName =
    products.length >= 4
      ? "w-60 flex-shrink-0 px-2 xs:w-80 snap-center"
      : "w-full px-2 flex justify-center";

  if (products.length >= 4) {
    const displayedProducts = isSmUp ? [...products, ...products] : products;

    return (
      <div className={carouselContainerClassName}>
        <div
          className={`${carouselClassName} sm:overflow-hidden`}
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
          }}
        >
          <div
            className={clsx(
              "flex w-max hover:[animation-play-state:paused]",
              isSmUp && "sm:animate-scroll-infinite"
            )}
          >
            {displayedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className={carouselItemClassName}
              >
                <ProductTile product={product} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  let maxWidthClassName = "";
  switch (products.length) {
    case 2:
      maxWidthClassName = "sm:max-w-[44rem]";
      break;
    case 3:
      maxWidthClassName = "lg:max-w-[64rem]";
      break;
  }

  return (
    <div className={carouselContainerClassName}>
      <div className={clsx(carouselClassName, maxWidthClassName)}>
        {products.map((product) => (
          <div key={product.id} className={carouselItemClassName}>
            <ProductTile product={product} locale={locale} />
          </div>
        ))}
      </div>
    </div>
  );
}