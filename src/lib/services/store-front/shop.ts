import { shopifyServerFetch } from '@/lib/shopify/store-front/server';

const GET_SHOP_NAME_QUERY = `
  query {
    shop {
      name
    }
  }
`;

export async function getShopName() {
  const data = await shopifyServerFetch<{ shop: { name: string } }>(
    GET_SHOP_NAME_QUERY,
    undefined
  );
  return data.shop.name;
}

const GET_SHOP_COLORS_CONFIG_METAFIELD_QUERY = `
  query GetShopMetafield {
    shop {
      metafield(namespace: "custom", key: "colors") {
        value
      }
    }
  }
`;

export async function getColorsConfig() {
  const data = await shopifyServerFetch<{
    shop: { metafield?: { value: string } };
  }>(GET_SHOP_COLORS_CONFIG_METAFIELD_QUERY, undefined);
  
  const configString = data?.shop?.metafield?.value;
  
  if (!configString) {
    console.error("Theme configuration metafield not found.");
    return null;
  }

  try {
    return JSON.parse(configString);
  } catch (error) {
    console.error("Failed to parse theme configuration JSON:", error);
    return null;
  }
}

const GET_HOME_IMAGE_URL_QUERY = `
  query GetHomeImage {
    shop {
      metafield(namespace: "custom", key: "home_image") {
        reference {
          ... on MediaImage {
            id
            image {
              url
            }
          }
        }
      }
    }
  }
`;

export async function getHomeImageUrl() {
  const data = await shopifyServerFetch<{
    shop: {
      metafield?: {
        reference?: {
          image?: {
            url: string;
          };
        };
      };
    };
  }>(GET_HOME_IMAGE_URL_QUERY, undefined);

  return data?.shop?.metafield?.reference?.image?.url;
}

const GET_LOGO_URL_QUERY = `
  query GetHomeImage {
    shop {
      metafield(namespace: "custom", key: "logo") {
        reference {
          ... on MediaImage {
            id
            image {
              url
            }
          }
        }
      }
    }
  }
`;

export async function getLogoUrl() {
  const data = await shopifyServerFetch<{
    shop: {
      metafield?: {
        reference?: {
          image?: {
            url: string;
          };
        };
      };
    };
  }>(GET_LOGO_URL_QUERY, undefined);

  return data?.shop?.metafield?.reference?.image?.url;
}