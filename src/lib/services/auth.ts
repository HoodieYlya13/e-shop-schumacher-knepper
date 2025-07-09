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

export async function createCustomerAccount(
  input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }
) {
  return shopifyServerFetch(REGISTER_MUTATION, { input });
}

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

export async function createCustomerAccessToken(input: {
  email: string;
  password: string;
}) {
  return shopifyServerFetch(LOGIN_MUTATION, { input });
}

const PASSWORD_RECOVERY_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function recoverCustomerAccount(email: string) {
  return shopifyServerFetch(PASSWORD_RECOVERY_MUTATION, { email });
}

const PASSWORD_RESET_BY_URL_MUTATION = `
  mutation customerResetByUrl($password: String!, $resetUrl: URL!) {
    customerResetByUrl(password: $password, resetUrl: $resetUrl) {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function resetCustomerPasswordByUrl(
  password: string,
  resetUrl: string
) {
  return shopifyServerFetch(PASSWORD_RESET_BY_URL_MUTATION, {
    password,
    resetUrl,
  });
}