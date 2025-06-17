import React from 'react';
import { getTranslations } from 'next-intl/server';
import { shopifyServerFetch } from '@/lib/shopify/server';
import Image from 'next/image';

type ShopifyProduct = {
    id: string;
    title: string;
    description: string;
    handle: string;
    images: {
      edges: {
        node: {
          url: string;
          altText: string | null;
        };
      }[];
    };
    variants: {
      edges: {
        node: {
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      }[];
    };
  };

  const QUERY = `
  query AllProducts($language: LanguageCode) @inContext(language: $language) {
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          handle
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default async function AllProducts({ locale }: { locale: string }) {
  const languageCode = locale.startsWith("fr")
    ? "FR"
    : locale.startsWith("de")
      ? "DE"
      : "EN";

  const t = await getTranslations({ locale, namespace: 'HOME_PAGE' });

  const data = await shopifyServerFetch<{
    products: {
      edges: { node: ShopifyProduct }[];
    };
  }>(QUERY, {
    variables: { language: languageCode },
  });

  const products: ShopifyProduct[] = data?.products?.edges?.map((edge) => edge.node) ?? [];

  return (
    <section className="p-6 space-y-12">
      {products.length === 0 && <p>{t("NO_PRODUCTS")}</p>}
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
                />
              ))}
            </div>
          )}

          <p className="mt-4 text-lg">
            {product.variants.edges[0]?.node.price.amount}{" "}
            {product.variants.edges[0]?.node.price.currencyCode}
          </p>
        </div>
      ))}
    </section>
  );
}