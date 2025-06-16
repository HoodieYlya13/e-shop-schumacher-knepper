import { shopifyClient } from './client';

export async function shopifyServerFetch<T>(query: string): Promise<T> {
  const response = await fetch(shopifyClient.getStorefrontApiUrl(), {
    method: 'POST',
    headers: shopifyClient.getPrivateTokenHeaders(),
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`[Shopify] ${response.statusText}`);
  }

  const json = await response.json();
  return json.data;
}