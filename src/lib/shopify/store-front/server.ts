import { getCustomerIp } from '@/utils/shared/getters/getCustomerIp';
import { shopifyClient } from './client';

export async function shopifyServerFetch<T, V = unknown>(
  query: string,
  variables?: V
): Promise<T> {
  const customerIp = await getCustomerIp();
  const headers = shopifyClient.getPrivateTokenHeaders({
    buyerIp: customerIp || undefined
  });

  const response = await fetch(shopifyClient.getStorefrontApiUrl(), {
    method: "POST",
    headers,
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