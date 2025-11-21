import { shopifyServerFetch } from "@/lib/shopify/store-front/server";
import { customerUpdateLocale } from "../admin/customer";
import { defaultLocale, LocaleLanguages } from "@/i18n/utils";

const REGISTER_MUTATION = `
  mutation createCustomerAccount($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export interface CustomerCreateResponse {
  customerCreate: {
    customer?: {
      id?: string;
      email?: string;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
    };
    customerUserErrors: {
      code?: string;
      field?: string[];
      message?: string;
    }[];
  };
}

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
): Promise<CustomerCreateResponse | null> {
  try {
    const response = await shopifyServerFetch<CustomerCreateResponse>(REGISTER_MUTATION, {
      input,
    });

    if (!response || response.customerCreate?.customerUserErrors?.length > 0) {
      console.error(
        "Error creating customer:",
        response.customerCreate?.customerUserErrors
      );
      return null;
    }

    const id = response.customerCreate?.customer?.id;
    if (id) await customerUpdateLocale(id, locale);

    return response;
  } catch (error) {
    console.error("Error creating customer account:", error);
    return null;
  }
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

export interface CustomerAccessTokenCreateResponse {
  customerAccessTokenCreate: {
    customerAccessToken?: {
      accessToken?: string;
      expiresAt?: string;
    },
    customerUserErrors: {
      field?: string[];
      message?: string;
    }[];
  };
}

export async function createCustomerAccessToken(input: {
  email: string;
  password: string;
}): Promise<CustomerAccessTokenCreateResponse | null> {
  try {
    const response = await shopifyServerFetch<CustomerAccessTokenCreateResponse>(LOGIN_MUTATION, {
      input,
    });

    if (
      !response ||
      response.customerAccessTokenCreate?.customerUserErrors?.length > 0
    ) {
      console.error(
        "Error creating customer access token:",
        response.customerAccessTokenCreate?.customerUserErrors
      );
      return null;
    }

    return response;
  } catch (error) {
    console.error("Error creating customer access token:", error);
    return null;
  }
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

export interface CustomerRecoverResponse {
  customerRecover: {
    customerUserErrors: {
      code?: string;
      field?: string[];
      message?: string;
    }[];
  };
}

export async function recoverCustomerAccount(
  email: string
): Promise<CustomerRecoverResponse | null> {
  try {
    const response = await shopifyServerFetch<CustomerRecoverResponse>(
      PASSWORD_RECOVERY_MUTATION,
      {
        email,
      }
    );

    if (!response || response.customerRecover?.customerUserErrors?.length > 0) {
      console.error(
        "Error recovering customer account:",
        response.customerRecover?.customerUserErrors
      );
      return null;
    }

    return response;
  } catch (error) {
    console.error("Error recovering customer account:", error);
    return null;
  }
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

export interface CustomerResetByUrlResponse {
  customerResetByUrl: {
    customer?: {
      id?: string;
      email?: string;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
    };
    customerAccessToken?: {
      accessToken?: string;
      expiresAt?: string;
    };
    customerUserErrors: {
      code?: string;
      field?: string[];
      message?: string;
    }[];
  };
}

export async function resetCustomerPasswordByUrl(input: {
  password: string;
  resetUrl: string;
}): Promise<CustomerResetByUrlResponse | null> {
  try {
    const response = await shopifyServerFetch<CustomerResetByUrlResponse>(PASSWORD_RESET_BY_URL_MUTATION, {
      input,
    });

    if (
      !response ||
      response.customerResetByUrl?.customerUserErrors?.length > 0
    ) {
      console.error(
        "Error recovering customer account:",
        response.customerResetByUrl?.customerUserErrors
      );
      return null;
    }

    return response;
  } catch (error) {
    console.error("Error resetting customer password by URL:", error);
    return null;
  }
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

interface CustomerDeleteAccessToken {
  customerAccessTokenDelete: {
    deletedAccessToken?: string;
    deletedCustomerAccessTokenId?: string;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export async function deleteCustomerAccessToken(
  customerAccessToken: string
): Promise<CustomerDeleteAccessToken | null> {
  try {
    const response = await shopifyServerFetch<CustomerDeleteAccessToken>(
      CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
      { customerAccessToken }
    );

    if (
      !response ||
      response.customerAccessTokenDelete?.userErrors?.length > 0
    ) {
      console.error(
        "Error deleting customer access token:",
        response.customerAccessTokenDelete?.userErrors
      );
      return null;
    }

    return response;
  } catch (error) {
    console.error("Error deleting customer access token:", error);
    return null;
  }
}

const CUSTOMER_ACCESS_TOKEN_VERIFICATION_QUERY = `
  query ($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
    }
  }
`;

export async function isCustomerAccessTokenValid(
  token: string
): Promise<boolean> {
  try {
    const response = await shopifyServerFetch<{
      customer: { id: string } | null;
    }>(CUSTOMER_ACCESS_TOKEN_VERIFICATION_QUERY, {
      customerAccessToken: token,
    });

    if (!response) {
      console.error("Error validating customer access token validity");
      return false;
    }

    return !!response.customer;
  } catch (error) {
    console.error("Error validating customer access token:", error);
    return false;
  }
}