import { shopifyServerFetch } from '@/lib/shopify/server';
import { Product } from '@shopify/hydrogen-react/storefront-api-types';

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

export async function getAllProducts(
  language: "EN" | "FR" | "DE" = "EN",
): Promise<Product[]> {
  const data = await shopifyServerFetch<{
    products: { edges: { node: Product }[] };
  }>(QUERY, { language });
  return data.products.edges.map((edge) => edge.node);
}