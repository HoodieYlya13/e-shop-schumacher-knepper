'use client';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { LocaleLanguages } from '@/i18n/utils';

const ProductTree = ({
  product,
  typeQueryParam,
  type,
}: {
  product: Product;
  typeQueryParam?: string;
  type?: string;
}) => {
  return (
    <div className="flex gap-2 truncate items-center">
      <Link href="/products" className="whitespace-nowrap transition hover:scale-105 duration-300">
        All products
      </Link>

      <span>&gt;</span>

      {type && (
        <>
          <Link
            href={`/products?${typeQueryParam}`}
            className="whitespace-nowrap transition hover:scale-105 duration-300"
          >
            {type}
          </Link>

          <span>&gt;</span>
        </>
      )}

      <Link href={`/products/${product.handle}`} className="truncate transition hover:scale-105 duration-300">
        {product.title}
      </Link>
    </div>
  );
};

const CurrentImage = ({ product, currentImageIndex, setCurrentImageIndex }: { product: Product; currentImageIndex: number; setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>> }) => {
  const featuredImage = product.images.edges[currentImageIndex]?.node;
  
  return (
    <div className="relative w-full max-w-100 aspect-square rounded-lg overflow-hidden shadow-lg">
      <Image
        src={featuredImage?.url}
        alt={featuredImage?.altText || product.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: "cover" }}
        priority
      />

      <button
        onClick={() =>
          setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : product.images.edges.length - 1
          )
        }
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full cursor-pointer"
      >
        &lt;
      </button>
      
      <button
        onClick={() =>
          setCurrentImageIndex((prev) =>
            prev < product.images.edges.length - 1 ? prev + 1 : 0
          )
        }
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full cursor-pointer"
      >
        &gt;
      </button>
    </div>
  );
}

const Thumbnail = ({ img, idx, isActive, product, setCurrentImageIndex }: { img: { id: string, url: string, altText?: string | null }, idx: number, isActive: boolean, product: Product, setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>> }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [isActive]);

  return (
    <div
      key={`${img.id}-${idx}`}
      ref={ref}
      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border cursor-pointer ${isActive ? "border-accent" : "border-light"}`}
      onClick={() => setCurrentImageIndex(idx)}
    >
      <Image
        src={img.url}
        alt={img.altText || product.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};

const Thumbnails = ({ product, currentImageIndex, setCurrentImageIndex }: { product: Product; currentImageIndex: number; setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>> }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-100">
      {product.images.edges.map(({ node: img }, idx) => (
        <Thumbnail
          key={`${img.id ?? idx}-${idx}`}
          img={{
            id: img.id ?? `${idx}`,
            url: img.url,
            altText: img.altText ?? null,
          }}
          idx={idx}
          isActive={currentImageIndex === idx}
          product={product}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      ))}
    </div>
  );
}

const addProductToCart = (
  variantId: string,
  quantity: number,
  product: Product
) => {
  if (typeof window !== 'undefined' && quantity > 0) {
    const storedCart = localStorage.getItem('cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];

    const existingItemIndex = cart.findIndex(
      (item: { variantId: string }) => item.variantId === variantId
    );

    const productData = {
      id: product.id,
      title: product.title,
      featuredImage: product.featuredImage
        ? {
            url: product.featuredImage.url,
            altText: product.featuredImage.altText,
          }
        : null,
      price: product.variants.edges[0]?.node.price.amount,
      currencyCode: product.variants.edges[0]?.node.price.currencyCode,
    };

    if (existingItemIndex > -1) cart[existingItemIndex].quantity += quantity;
    else cart.push({
      variantId,
      quantity,
      product: productData,
    });

    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export default function Product({
  locale,
  product,
}: {
  locale: LocaleLanguages;
  product: Product;
}) {
  const t = useTranslations("PRODUCT_PAGE");
  const [quantity, setQuantity] = useState(1);
  const mainVariant = product.variants.edges[0]?.node;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const typeCollection = product.collections.edges.find(({ node }) =>
    node.title.startsWith("type_")
  );
  const type = typeCollection
    ? typeCollection.node.title.split("__")[1]?.replace(/^type_/i, "") ?? ""
    : "";
  const typeQueryParam = typeCollection
    ? typeCollection.node.title.split("__")[0]?.replace(/_/g, "=") ?? ""
    : ""; 

  const handleAddToCart = () => {
    if (mainVariant) addProductToCart(mainVariant.id, quantity, product);
  };

  return (
    <section className="container mx-auto flex flex-col gap-2 md:gap-4">
      <ProductTree
        product={product}
        typeQueryParam={typeQueryParam}
        type={type}
      />

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-100">
          {product.images.edges.length > 0 && (
            <div className="flex flex-col gap-2 pb-2">
              {product.images.edges.length > 0 && (
                <div className="flex flex-col gap-4 relative">
                  <CurrentImage
                    product={product}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                  />

                  <Thumbnails
                    product={product}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:w-1/2 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold">{product.title}</h1>

          {mainVariant && (
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold">
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: mainVariant.price.currencyCode,
                }).format(parseFloat(mainVariant.price.amount))}
              </span>
              {mainVariant.compareAtPrice && (
                <span className="text-xl line-through">
                  {new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: mainVariant.compareAtPrice.currencyCode,
                  }).format(parseFloat(mainVariant.compareAtPrice.amount))}
                </span>
              )}
            </div>
          )}

          <div className="leading-relaxed">
            <h2 className="text-xl font-semibold mb-2">{t("DESCRIPTION")}</h2>
            <p>{product.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">{t("AVAILABILITY")}:</span>
            <span
              className={`text-lg font-bold ${mainVariant?.availableForSale ? "text-valid" : "text-invalid"}`}
            >
              {mainVariant?.availableForSale
                ? t("IN_STOCK")
                : t("OUT_OF_STOCK")}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-light rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-xl font-bold w-8 hover:bg-ultra-light rounded-l-lg cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                className="w-12 text-center border-none focus:outline-none no-spin-arrows"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setQuantity(value > 0 ? value : 1);
                }}
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-xl font-bold w-8 hover:bg-ultra-light rounded-r-lg cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 md:flex-none w-full md:w-auto px-6 py-3 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-colors duration-300 cursor-pointer"
              disabled={!mainVariant?.availableForSale || quantity < 1}
            >
              {mainVariant?.availableForSale ? t("ADD_TO_CART") : t("SOLD_OUT")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}