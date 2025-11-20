import { defaultLocaleUpperCase, LocaleLanguagesUpperCase } from '@/i18n/utils';
import { shopifyServerFetch } from '@/lib/shopify/store-front/server';
import { Collection, Product } from '@shopify/hydrogen-react/storefront-api-types';

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
          featuredImage {
            url
            altText
          }
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
                availableForSale
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

export async function getAllProducts(
  language: LocaleLanguagesUpperCase = defaultLocaleUpperCase,
  sortKey: string = 'TITLE',
  reverse: boolean = false
): Promise<Product[]> {
  const allProducts: Product[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const data: ShopifySearchProductsResponse =
      await shopifyServerFetch<ShopifySearchProductsResponse>(
        GET_ALL_PRODUCTS_QUERY,
        {
          language,
          after: cursor,
          sortKey,
          reverse,
        }
      );

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
          description
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
    }
  }
`;

export async function getProductsForLiveSearch(
  title: string,
  language: LocaleLanguagesUpperCase = defaultLocaleUpperCase
): Promise<Product[]> {
  const query = `title:*${title}*`;
  const data = await shopifyServerFetch<ShopifySearchProductsResponse>(
    SEARCH_PRODUCTS_QUERY,
    {
      query,
      language,
      first: 3,
    }
  );

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
    const data: ShopifySearchProductsResponse =
      await shopifyServerFetch<ShopifySearchProductsResponse>(
        SEARCH_PRODUCTS_QUERY,
        {
          query,
          language,
          first: 250,
          after: cursor,
        }
      );

    allProducts.push(...data.products.edges.map((edge) => edge.node));

    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}

const GET_COLLECTION_BY_HANDLE_QUERY = `
  query CollectionByHandle($handle: String!, $language: LanguageCode) @inContext(language: $language) {
    collection(handle: $handle) {
      title
      description
      image {
        url
        altText
      }
    }
  }
`;

interface ShopifyCollectionResponse {
  collection: Collection;
}

export async function getCollectionByHandle(
  handle: string,
  language: LocaleLanguagesUpperCase = defaultLocaleUpperCase
) {
  const data: ShopifyCollectionResponse =
    await shopifyServerFetch<ShopifyCollectionResponse>(
      GET_COLLECTION_BY_HANDLE_QUERY,
      { handle, language }
    );

  return data.collection || null;
}

const GET_PRODUCTS_BY_COLLECTION_HANDLE_QUERY = `
  query ProductsByCollectionHandle($handle: String!, $language: LanguageCode, $after: String) @inContext(language: $language) {
    collection(handle: $handle) {
      products(first: 250, after: $after) {
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
            featuredImage {
              url
              altText
            }
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
                  availableForSale
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
  }
`;

interface ShopifyProductsByCollectionResponse {
  collection: {
    products: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      edges: {
        node: Product;
      }[];
    };
  };
}

export async function getProductsByCollectionHandle(
  handle: string,
  language: LocaleLanguagesUpperCase = defaultLocaleUpperCase
): Promise<Product[]> {
  const allProducts: Product[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const data: ShopifyProductsByCollectionResponse =
      await shopifyServerFetch<ShopifyProductsByCollectionResponse>(
        GET_PRODUCTS_BY_COLLECTION_HANDLE_QUERY,
        {
          handle,
          language,
          after: cursor,
        }
      );

    if (!data.collection?.products) break;

    allProducts.push(
      ...data.collection.products.edges.map((edge) => edge.node)
    );
    hasNextPage = data.collection.products.pageInfo.hasNextPage;
    cursor = data.collection.products.pageInfo.endCursor;
  }

  return allProducts;
}