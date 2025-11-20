import { LocaleLanguagesUpperCase } from "@/i18n/utils";
import { shopifyServerFetch } from "@/lib/shopify/store-front/server";

const CART_LINES_FRAGMENT = `
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation cartCreate($cartInput: CartInput!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    cartCreate(input: $cartInput) {
      cart {
        id
        checkoutUrl
        ${CART_LINES_FRAGMENT}
      }
      userErrors {
        code
        message
      }
    }
  }
`;

export async function createCheckout(
  options: {
    lineItems: Array<{
      variantId: string;
      quantity: number;
    }>;
    customerAccessToken?: string;
    country?: LocaleLanguagesUpperCase;
    language?: LocaleLanguagesUpperCase;
  }
) {
  const countryCode = options.country || "LU";
  const languageCode = options.language || "EN";

  const variables = {
    cartInput: {
      lines: options.lineItems.map(item => ({
        quantity: item.quantity,
        merchandiseId: item.variantId,
      })),
      ...(options.customerAccessToken && {
        buyerIdentity: {
          customerAccessToken: options.customerAccessToken,
        },
      }),
    },
    country: countryCode,
    language: languageCode,
  };

  const data = await shopifyServerFetch<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        lines: {
          edges: Array<{
            node: {
              id: string;
              quantity: number;
              merchandise: {
                id: string;
              };
            };
          }>;
        };
      };
      userErrors: Array<{
        code: string;
        message: string;
      }>;
    };
  }>(CREATE_CART_MUTATION, variables);

  const cart = data.cartCreate.cart;
  return cart;
}

const UPDATE_CUSTOMER_IDENTITY_MUTATION = `
  mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        code
        message
      }
    }
  }
`;

export async function updateCustomerIdentity(
  cartId: string,
  options: {
    email?: string;
    customerAccessToken?: string;
    phone?: string;
    countryCode?: string;
  }
) {
  const buyerIdentity: Record<string, unknown> = {
    email: null,
    customerAccessToken: "",
    phone: null,
    countryCode: null,
  };
  if (options.email) buyerIdentity.email = options.email;
  if (options.customerAccessToken) buyerIdentity.customerAccessToken = options.customerAccessToken;
  if (options.phone) buyerIdentity.phone = options.phone;
  if (options.countryCode) buyerIdentity.countryCode = options.countryCode;

  const variables = {
    cartId,
    buyerIdentity,
  };

  const data = await shopifyServerFetch<{
    cartBuyerIdentityUpdate: {
      cart: {
        id: string;
        checkoutUrl: string;
      };
      userErrors: Array<{
        code: string;
        message: string;
      }>;
    };
  }>(UPDATE_CUSTOMER_IDENTITY_MUTATION, variables);

  return data.cartBuyerIdentityUpdate.cart.checkoutUrl;
}

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode, $language: LanguageCode) 
  @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        ${CART_LINES_FRAGMENT}
      }
      userErrors {
        code
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode, $language: LanguageCode) 
  @inContext(country: $country, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        ${CART_LINES_FRAGMENT}
      }
      userErrors {
        code
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode, $language: LanguageCode) 
  @inContext(country: $country, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        ${CART_LINES_FRAGMENT}
      }
      userErrors {
        code
        message
      }
    }
  }
`;

export type CartOperation =
  | { type: 'add'; variantId: string; quantity: number }
  | { type: 'update'; lineId: string; quantity: number }
  | { type: 'remove'; lineIds: string[] };

export async function updateCheckoutLines(
  cartId: string,
  operation: CartOperation,
  options: {
    country?: LocaleLanguagesUpperCase;
    language?: LocaleLanguagesUpperCase;
  } = {}
) {
  const country = options.country || "LU";
  const language = options.language || "EN";

  let mutation = '';
  const variables: {
    cartId: string;
    country: LocaleLanguagesUpperCase | "LU";
    language: LocaleLanguagesUpperCase;
    lines?: Array<Record<string, unknown>>;
    lineIds?: string[];
  } = {
    cartId,
    country,
    language,
  };

  switch (operation.type) {
    case 'add':
      mutation = CART_LINES_ADD_MUTATION;
      variables.lines = [{
        merchandiseId: operation.variantId,
        quantity: operation.quantity
      }];
      break;

    case 'update':
      mutation = CART_LINES_UPDATE_MUTATION;
      variables.lines = [{
        id: operation.lineId,
        quantity: operation.quantity
      }];
      break;

    case 'remove':
      mutation = CART_LINES_REMOVE_MUTATION;
      variables.lineIds = operation.lineIds;
      break;
  }

  const data = await shopifyServerFetch<{
    [key: string]: {
      cart: {
        id: string;
        checkoutUrl: string;
        lines: {
          edges: Array<{
            node: {
              id: string; // THIS IS THE lineId
              quantity: number;
              merchandise: {
                id: string; // THIS IS THE variantId
              };
            };
          }>;
        };
      };
      userErrors: Array<{
        code: string;
        message: string;
      }>;
    };
  }>(mutation, variables);

  const responseKey = Object.keys(data)[0]; 
  const result = data[responseKey as keyof typeof data];

  if (result.userErrors.length > 0) console.error("Cart Update Error:", result.userErrors);

  return result.cart;
}