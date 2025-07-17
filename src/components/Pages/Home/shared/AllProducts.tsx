'use client';

import { Product } from '@shopify/hydrogen-react/storefront-api-types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface AllProductsProps {
  products: Product[]
};

export default function AllProducts({ products }: AllProductsProps) {
  const t = useTranslations("HOME_PAGE");

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