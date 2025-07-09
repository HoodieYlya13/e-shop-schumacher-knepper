import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getAllProducts } from '@/lib/services/products';
import { Product } from '@shopify/hydrogen-react/storefront-api-types';
import Image from 'next/image';
import { getPreferredLocale } from '@/utils/shared/getters/getPreferredLocale';

export default async function AllProducts({ locale }: { locale: string }) {
  const languageCode = getPreferredLocale()?.toUpperCase() as 'EN' | 'FR' | 'DE' | undefined;

  const t = await getTranslations({ locale, namespace: 'HOME_PAGE' });
  const products: Product[] = await getAllProducts(languageCode);

  return (
    <section className="p-6 space-y-12">
      {products.length === 0 && <p>{t('NO_PRODUCTS')}</p>}
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-gray-700">{product.description}</p>

          {product.images.edges.length > 0 && (
            <div className="mt-4 flex gap-4 overflow-x-auto">
              {product.images.edges.map((imgEdge, i) => (
                <Image
                  key={i}
                  src={imgEdge.node.url}
                  alt={imgEdge.node.altText ?? product.title}
                  width={192}
                  height={192}
                  className="w-48 h-48 object-cover rounded"
                  priority={i === 0}
                />
              ))}
            </div>
          )}

          <p className="mt-4 text-lg">
            {product.variants.edges[0]?.node.price.amount}{' '}
            {product.variants.edges[0]?.node.price.currencyCode}
          </p>
        </div>
      ))}
    </section>
  );
}