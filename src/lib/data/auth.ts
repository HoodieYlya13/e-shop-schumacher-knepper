import { shopifyServerFetch } from '@/lib/shopify/server';

const REGISTER_MUTATION = `
  mutation createCustomerAccount($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const LOGIN_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

export async function registerCustomer(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptsMarketing?: boolean;
}) {
  return shopifyServerFetch(REGISTER_MUTATION, {
    variables: { input },
  });
}

export async function loginCustomer(input: {
  email: string;
  password: string;
}) {
  return shopifyServerFetch(LOGIN_MUTATION, {
    variables: { input },
  });
}