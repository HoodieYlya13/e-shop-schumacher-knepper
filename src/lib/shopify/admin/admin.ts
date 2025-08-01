import { createAdminApiClient } from "@shopify/admin-api-client";

export const shopifyAdmin = createAdminApiClient({
  storeDomain: process.env.NEXT_PUBLIC_STORE_DOMAIN!,
  apiVersion: process.env.SHOPIFY_API_VERSION!,
  accessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
});