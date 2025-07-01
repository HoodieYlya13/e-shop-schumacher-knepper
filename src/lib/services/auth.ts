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
  return shopifyServerFetch(PASSWORD_RECOVERY_MUTATION, {
    variables: { email },
    buyerIp,
  });
}

const PASSWORD_RESET_MUTATION = `
  mutation resetCustomerAccount($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
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
    }
  }
`;

export async function resetCustomerPassword(
  id: string,
  input: {
    password: string;
    resetToken: string;
  },
  buyerIp?: string
) {
  return shopifyServerFetch(PASSWORD_RESET_MUTATION, {
    variables: { id: `gid://shopify/Customer/${id}`, input },
    buyerIp,
  });
}