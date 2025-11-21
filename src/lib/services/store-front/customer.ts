import { shopifyServerFetch } from "@/lib/shopify/store-front/server";
import { Customer } from "@shopify/hydrogen-react/storefront-api-types";

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
  token: string
): Promise<Customer | null> {
  try {
    const response = await shopifyServerFetch<{ customer: Customer }>(
      CUSTOMER_METAFIELDS_QUERY,
      {
        customerAccessToken: token,
        identifiers: [
          { namespace: "Membership", key: "VIP level" },
          { namespace: "Membership", key: "startDate" },
          { namespace: "note", key: "preference" },
        ],
      }
    );

    if (!response?.customer) {
      console.error("Error while fetching customer data");
      return null;
    }

    return response.customer;
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return null;
  }
}