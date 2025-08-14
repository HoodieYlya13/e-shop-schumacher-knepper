'use client';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        variantId,
        quantity,
        product: productData,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }
};
export default function Product({ product }: { product: Product }) {
  const t = useTranslations('PRODUCT_PAGE');
  const [quantity, setQuantity] = useState(1);
  const featuredImage = product.featuredImage;
  const mainVariant = product.variants.edges[0]?.node;

  const handleAddToCart = () => {
    if (mainVariant) {
      addProductToCart(mainVariant.id, quantity, product);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 pt-26 md:pt-36">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          {featuredImage && (
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={featuredImage.url}
                alt={featuredImage.altText || product.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}
        </div>

        <div className="md:w-1/2 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
          
          {mainVariant && (
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-gray-900">
                {mainVariant.price.amount} {mainVariant.price.currencyCode}
              </span>
              {mainVariant.compareAtPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {mainVariant.compareAtPrice.amount} {mainVariant.compareAtPrice.currencyCode}
                </span>
              )}
            </div>
          )}

          <div className="text-gray-700 leading-relaxed">
            <h2 className="text-xl font-semibold mb-2">{t('DESCRIPTION')}</h2>
            <p>{product.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">
              {t('AVAILABILITY')}:
            </span>
            <span className={`text-lg font-bold ${mainVariant?.availableForSale ? 'text-green-600' : 'text-red-600'}`}>
              {mainVariant?.availableForSale ? t('IN_STOCK') : t('OUT_OF_STOCK')}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-xl font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg"
              >
                -
              </button>
              <input
                type="number"
                className="w-12 text-center border-none focus:outline-none"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setQuantity(value > 0 ? value : 1);
                }}
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-xl font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="flex-1 md:flex-none w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
              disabled={!mainVariant?.availableForSale || quantity < 1}
            >
              {mainVariant?.availableForSale ? t('ADD_TO_CART') : t('SOLD_OUT')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}