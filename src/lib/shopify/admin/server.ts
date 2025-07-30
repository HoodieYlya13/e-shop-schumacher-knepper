import { shopifyAdmin } from './admin';

export async function shopifyAdminFetch<T, V extends { [key: string]: unknown } = { [key: string]: unknown }>(
  query: string,
  variables?: V
): Promise<T> {
  try {
    const { data, errors } = await shopifyAdmin.request(query, {
      variables,
    });
  
    if (errors) {
      if (Array.isArray(errors)) {
        const errorMessages = errors.map(err => err.message).join(', ');
        throw new Error(`[Shopify Admin API] GraphQL Errors: ${errorMessages}`);
      } else {
        console.error('Non-array GraphQL errors:', errors);
        throw new Error(`[Shopify Admin API] Unknown GraphQL error structure.`);
      }
    }
  
    return data as T;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "response" in error)
      console.error(
        "GraphQL response error",
        (error as { response: unknown }).response
      );
    console.error('Error during Shopify Admin API request:', error);
    throw error;
  }
}