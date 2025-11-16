import { shopifyServerFetch } from '@/lib/shopify/store-front/server';
import { convertGoogleMapsUrl } from '@/utils/shared/convertGoogleMapsUrl';

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

export async function getShopLocationUrl(): Promise<string> {
  const embedUrl = convertGoogleMapsUrl(
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10364.189363249656!2d6.35322!3d49.5025!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795155944acdcb7%3A0xc23fde4d449060d4!2sDomaine%20viticole%20Schumacher-Knepper!5e0!3m2!1sfr!2sus!4v1763323542825!5m2!1sfr!2sus"
  );
  return embedUrl;
}

interface ShopLocation {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export async function getShopLocation(): Promise<ShopLocation> {
  return {
    name: "Domaine Viticole Schumacher-Knepper",
    street: "28, Wäistrooss",
    postalCode: "L-5495",
    city: "Wintrange",
    country: "Luxemburg"
  };
}

export interface ShopPhone {
  phoneNumber: string;
  phoneDisplayed: string;
}

export async function getShopPhone(): Promise<ShopPhone> {
  return {
    phoneNumber: "+352236045",
    phoneDisplayed: "+352 23 60 45",
  };
}

export async function getShopMail(): Promise<string> {
  return "info@schumacher-knepper.lu";
}

interface ShopFax {
  faxNumber: string;
  faxDisplayed: string;
}

export async function getShopFax(): Promise<ShopFax> {
  return {
    faxNumber: "+35223664803",
    faxDisplayed: "+352 23 66 48 03",
  };
}