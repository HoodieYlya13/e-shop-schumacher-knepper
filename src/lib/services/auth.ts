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
  },
  buyerIp?: string
) {
  console.log(`Buyer IP: ${buyerIp}`);

  return shopifyServerFetch(REGISTER_MUTATION, {
    variables: { input },
    buyerIp,
  });
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

export async function createCustomerAccessToken(
  input: {
    email: string;
    password: string;
  },
  buyerIp?: string
) {
  console.log(`Buyer IP: ${buyerIp}`);

  return shopifyServerFetch(LOGIN_MUTATION, {
    variables: { input },
    buyerIp,
  });
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

export async function recoverCustomerAccount(email: string, buyerIp?: string) {
  console.log(`Buyer IP: ${buyerIp}`);

  return shopifyServerFetch(PASSWORD_RECOVERY_MUTATION, {
    variables: { email },
    buyerIp,
  });
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
  resetUrl: string,
  buyerIp?: string
) {
  console.log(`Buyer IP: ${buyerIp}`);

  return shopifyServerFetch(PASSWORD_RESET_BY_URL_MUTATION, {
    variables: { password, resetUrl },
    buyerIp,
  });
}