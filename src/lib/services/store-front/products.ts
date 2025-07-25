import { shopifyServerFetch } from '@/lib/shopify/store-front/server';
import { Product } from '@shopify/hydrogen-react/storefront-api-types';

const GET_ALL_PRODUCTS_QUERY = `
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

export async function getAllProducts(language: "EN" | "FR" | "DE" = "EN"): Promise<Product[]> {
  const data = await shopifyServerFetch<{
    products: { edges: { node: Product }[] };
  }>(GET_ALL_PRODUCTS_QUERY, { language });
  return data.products.edges.map((edge) => edge.node);
}