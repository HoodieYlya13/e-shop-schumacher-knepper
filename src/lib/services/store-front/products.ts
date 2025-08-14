import { defaultLocaleUpperCase, LocaleLanguagesUpperCase } from '@/i18n/utils';
import { shopifyServerFetch } from '@/lib/shopify/store-front/server';
import { Product } from '@shopify/hydrogen-react/storefront-api-types';

const GET_ALL_PRODUCTS_QUERY = `
  query AllProducts($language: LanguageCode, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean) @inContext(language: $language) {
    products(first: 250, after: $after, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
                id
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
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

interface ShopifyProductsResponse {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: {
      node: Product;
    }[];
  };
}

export async function getAllProducts(
  language: LocaleLanguagesUpperCase = defaultLocaleUpperCase,
  sortKey: string = 'TITLE',
  reverse: boolean = false
): Promise<Product[]> {
  const allProducts: Product[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const data: ShopifyProductsResponse = await shopifyServerFetch<ShopifyProductsResponse>(GET_ALL_PRODUCTS_QUERY, {
      language,
      after: cursor,
      sortKey,
      reverse,
    });

    allProducts.push(...data.products.edges.map((edge) => edge.node));

    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}

const GET_SINGLE_PRODUCT_QUERY = `
  query SingleProduct($handle: String!, $language: LanguageCode) @inContext(language: $language) {
    product(handle: $handle) {
      id
      title
      description
      handle
      tags
      seo {
        title
        description
      }
      featuredImage {
        url
        altText
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            sku
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
      collections(first: 10) {
        edges {
          node {
            title
            handle
          }
        }
      }
    }
  }
`;

interface ShopifySingleProductResponse {
  product: Product;
}

export async function getSingleProduct(
  handle: string,
  language: LocaleLanguagesUpperCase = defaultLocaleUpperCase
): Promise<Product | undefined> {
  const data = await shopifyServerFetch<ShopifySingleProductResponse>(GET_SINGLE_PRODUCT_QUERY, {
    handle,
    language,
  });

  return data.product;
}

const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!, $language: LanguageCode, $first: Int!, $after: String) @inContext(language: $language) {
    products(first: $first, query: $query, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
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
                id
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

interface ShopifySearchProductsResponse {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: {
      node: Product;
    }[];
  };
}

export async function getProductsForLiveSearch(
  title: string,
  language: LocaleLanguagesUpperCase = defaultLocaleUpperCase
): Promise<Product[]> {
  const query = `title:*${title}*`;
  const data = await shopifyServerFetch<ShopifySearchProductsResponse>(SEARCH_PRODUCTS_QUERY, {
    query,
    language,
    first: 3,
  });

  return data.products.edges.map((edge) => edge.node);
}

export async function getProductsForFullSearch(
  title: string,
  language: LocaleLanguagesUpperCase = defaultLocaleUpperCase
): Promise<Product[]> {
  const allProducts: Product[] = [];
  const query = `title:*${title}*`;
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const data: ShopifySearchProductsResponse = await shopifyServerFetch<ShopifySearchProductsResponse>(SEARCH_PRODUCTS_QUERY, {
      query,
      language,
      first: 250,
      after: cursor,
    });

    allProducts.push(...data.products.edges.map((edge) => edge.node));

    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}