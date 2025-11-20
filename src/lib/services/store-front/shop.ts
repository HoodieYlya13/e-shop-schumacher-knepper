import { shopifyServerFetch } from "@/lib/shopify/store-front/server";
import { convertGoogleMapsUrl } from "@/utils/shared/convertGoogleMapsUrl";

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

const GET_SHOP_METAFIELD_QUERY = `
  query GetShopMetafield($key: String!) {
    shop {
      metafield(namespace: "custom", key: $key) {
        value
      }
    }
  }
`;

async function getShopMetafieldValue(key: string): Promise<string | null> {
  const data = await shopifyServerFetch<{
    shop: { metafield?: { value: string } | null };
  }>(GET_SHOP_METAFIELD_QUERY, { key });

  return data?.shop?.metafield?.value || null;
}

async function getShopMetafieldJson<T>(key: string): Promise<T | null> {
  const value = await getShopMetafieldValue(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to parse metafield ${key} JSON:`, error);
    return null;
  }
}

export async function getColorsConfig() {
  return getShopMetafieldJson<Record<string, string>>("colors");
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

// TODO: Replace 'XXXXXX' with the actual metafield key for the XXXXXX image
const GET_IMAGE_URL_QUERY = `
  query GetXXXXXXImage {
    shop {
      metafield(namespace: "custom", key: "XXXXXX") {
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

export async function getImageUrl() {
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
  }>(GET_IMAGE_URL_QUERY, undefined);

  return data?.shop?.metafield?.reference?.image?.url;
}

export async function getShopLocationUrl(): Promise<string | null> {
  const rawValue = await getShopMetafieldValue("shop_location_url");

  if (!rawValue) {
    console.error("Shop location URL metafield missing.");
    return null;
  }

  let parsed: { text?: string; url?: string } | null = null;

  try {
    parsed = JSON.parse(rawValue);
  } catch {
    try {
      return convertGoogleMapsUrl(rawValue);
    } catch {
      return rawValue;
    }
  }

  if (!parsed?.url) {
    console.error("Shop location metafield missing `.url` field.");
    return null;
  }

  try {
    return convertGoogleMapsUrl(parsed.url);
  } catch {
    return parsed.url;
  }
}

interface ShopLocation {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export async function getShopLocation(): Promise<ShopLocation | null> {
  const parsed = await getShopMetafieldJson<ShopLocation>("shop_location");

  if (!parsed) {
    console.error("Shop location metafield missing or invalid.");
    return null;
  }

  if (
    !parsed.name ||
    !parsed.street ||
    !parsed.postalCode ||
    !parsed.city ||
    !parsed.country
  ) {
    console.error("Shop location metafield missing required fields.");
    return null;
  }

  return parsed;
}

export interface ShopPhone {
  phoneNumber: string;
  phoneDisplayed: string;
}

export async function getShopPhone(): Promise<ShopPhone | null> {
  const parsed = await getShopMetafieldJson<ShopPhone>("shop_phone");

  if (!parsed) {
    console.error("Shop phone metafield missing or invalid.");
    return null;
  }

  if (!parsed.phoneNumber || !parsed.phoneDisplayed) {
    console.error("Shop phone metafield missing required fields.");
    return null;
  }

  return parsed;
}

export async function getShopEmail(): Promise<string | null> {
  const email = await getShopMetafieldValue("shop_email");

  if (!email) {
    console.error("Shop email metafield missing.");
    return null;
  }

  return email;
}

interface ShopFax {
  faxNumber: string;
  faxDisplayed: string;
}

export async function getShopFax(): Promise<ShopFax | null> {
  const parsed = await getShopMetafieldJson<ShopFax>("shop_fax");

  if (!parsed) {
    console.error("Shop fax metafield missing or invalid.");
    return null;
  }

  if (!parsed.faxNumber || !parsed.faxDisplayed) {
    console.error("Shop fax metafield missing required fields.");
    return null;
  }

  return parsed;
}

interface ShopPageContent {
  title: string;
  articles: {
    title: string;
    paragraphs: string[];
  }[];
}

export async function getShopDeliveryPolicies(): Promise<ShopPageContent | null> {
  const parsed =
    await getShopMetafieldJson<ShopPageContent>("delivery_policies");

  if (!parsed) {
    console.error("Delivery policies metafield missing or invalid.");
    return null;
  }

  if (!parsed.title || !Array.isArray(parsed.articles)) {
    console.error("Invalid delivery policies format.");
    return null;
  }

  return parsed;
}

export async function getShopGeneralPolicies(): Promise<ShopPageContent | null> {
  const parsed =
    await getShopMetafieldJson<ShopPageContent>("general_policies");

  if (!parsed) {
    console.error("General policies metafield missing or invalid.");
    return null;
  }

  if (
    !parsed.title ||
    !Array.isArray(parsed.articles) ||
    parsed.articles.some(
      (article) => !article.title || !Array.isArray(article.paragraphs)
    )
  ) {
    console.error("Invalid general policies format.");
    return null;
  }

  return parsed;
}

export async function getShopAboutUs(): Promise<ShopPageContent | null> {
  const parsed = await getShopMetafieldJson<ShopPageContent>("shop_about_us");

  if (!parsed) {
    console.error("About us metafield missing or invalid.");
    return null;
  }

  if (
    !parsed.title ||
    !Array.isArray(parsed.articles) ||
    parsed.articles.some(
      (article) => !article.title || !Array.isArray(article.paragraphs)
    )
  ) {
    console.error("Invalid about us format.");
    return null;
  }

  return parsed;
}
