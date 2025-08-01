import { shopifyServerFetch } from '@/lib/shopify/store-front/server';
import { customerUpdateLocale } from '../admin/customer';
import { CustomerCreateResponse } from '@/utils/auth/handlers/shared/registerHandler';
import { defaultLocale, LocaleLanguages } from '@/i18n/utils';

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
  locale: LocaleLanguages = defaultLocale
) {  
  const response = await shopifyServerFetch(REGISTER_MUTATION, { input }) as CustomerCreateResponse;

  const id = response.customerCreate?.customer?.id;
  if (id) await customerUpdateLocale(id, locale);
  
  return response;
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
  }
) {
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
  input: {
    password: string;
    resetUrl: string;
  }
) {
  return shopifyServerFetch(PASSWORD_RESET_BY_URL_MUTATION, { input });
}

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

export async function deleteCustomerAccessToken(customerAccessToken: string) {
  return shopifyServerFetch(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, { customerAccessToken });
}

const CUSTOMER_ACCESS_TOKEN_VERIFICATION_QUERY = `
  query ($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
    }
  }
`;

export async function isCustomerAccessTokenValid(token: string): Promise<boolean> {
  const data = await shopifyServerFetch<{
    customer: { id: string } | null;
  }>(CUSTOMER_ACCESS_TOKEN_VERIFICATION_QUERY, { customerAccessToken: token });

  return !!data.customer;
}