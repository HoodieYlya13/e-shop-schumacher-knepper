import { createStorefrontClient } from "@shopify/hydrogen-react";

export const shopifyClient = createStorefrontClient({
  storeDomain: process.env.PUBLIC_STORE_DOMAIN!,
  publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN!,
  privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN!,
  storefrontApiVersion: process.env.SHOPIFY_API_VERSION!,
});