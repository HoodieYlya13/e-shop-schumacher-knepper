import { shopifyClient } from './client';

export async function shopifyServerFetch<T>(
  query: string,
  options?: { variables?: Record<string, any> }
): Promise<T> {
  const response = await fetch(shopifyClient.getStorefrontApiUrl(), {
    method: "POST",
    headers: shopifyClient.getPrivateTokenHeaders(),
    body: JSON.stringify({
      query,
      variables: options?.variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`[Shopify] ${response.statusText}`);
  }

  const json = await response.json();
  return json.data;
}