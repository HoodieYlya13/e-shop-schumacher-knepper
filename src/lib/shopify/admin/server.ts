import { shopifyAdmin } from './admin';

export async function shopifyAdminFetch<T, V extends Record<string, any> = Record<string, any>>(
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
  } catch (error: any) {
    if (error?.response) {
      console.error('GraphQL response error', error.response);
    }
    console.error('Error during Shopify Admin API request:', error);
    throw error;
  }
}