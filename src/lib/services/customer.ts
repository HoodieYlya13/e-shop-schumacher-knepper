import { shopifyServerFetch } from '@/lib/shopify/server';
import { Customer } from '@shopify/hydrogen-react/storefront-api-types';

const CUSTOMER_METAFIELDS_QUERY = `
  query CustomerMetafields($customerAccessToken: String!, $identifiers: [HasMetafieldsIdentifier!]!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      metafields(identifiers: $identifiers) {
        id
        key
        value
        namespace
        type
      }
    }
  }
`;

export async function fetchCustomerData(
  token: string,
  identifiers: { namespace: string; key: string }[],
  buyerIp?: string
): Promise<Customer | null> {
  const data = await shopifyServerFetch<{ customer: Customer }>(
    CUSTOMER_METAFIELDS_QUERY,
    {
      variables: {
        customerAccessToken: token,
        identifiers,
      },
      buyerIp,
    }
  );

  return data.customer ?? null;
}