import { getBuyerIp } from '@/utils/shared/getters/getBuyerIp';
import { shopifyClient } from './client';

export async function shopifyServerFetch<T, V = unknown>(
  query: string,
  variables?: V
): Promise<T> {
  const buyerIp = await getBuyerIp();

  const response = await fetch(shopifyClient.getStorefrontApiUrl(), {
    method: "POST",
    headers: {
      ...shopifyClient.getPrivateTokenHeaders(),
      "Shopify-Storefront-Buyer-IP": buyerIp ?? "",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`[Shopify] ${response.statusText}`);
  }

  const json = await response.json();
  return json.data;
}