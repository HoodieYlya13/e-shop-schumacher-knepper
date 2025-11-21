import { LocaleLanguagesUpperCase } from "@/i18n/utils";
import { shopifyServerFetch } from "@/lib/shopify/store-front/server";
import {
  CountryCode,
  LanguageCode,
} from "@shopify/hydrogen-react/storefront-api-types";

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

interface CartCreateResponse {
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
}

export async function createCheckout(options: {
  lineItems: Array<{
    variantId: string;
    quantity: number;
  }>;
  customerAccessToken?: string;
  country?: CountryCode;
  language?: LanguageCode;
}): Promise<CartCreateResponse["cartCreate"]["cart"] | null> {
  const countryCode = options.country || "LU";
  const languageCode = options.language || "EN";

  const variables = {
    cartInput: {
      lines: options.lineItems.map((item) => ({
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

  try {
    const response = await shopifyServerFetch<CartCreateResponse>(
      CREATE_CART_MUTATION,
      variables
    );

    if (!response?.cartCreate?.cart) {
      console.error("Failed to create cart:", response?.cartCreate?.userErrors);
      return null;
    }

    const cart = response.cartCreate.cart;
    return cart;
  } catch (error) {
    console.error("Error creating checkout:", error);
    return null;
  }
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

interface UpdateCustomerIdentityResponse {
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
}

export async function updateCustomerIdentity(
  cartId: string,
  options: {
    email?: string;
    customerAccessToken?: string;
    phone?: string;
    countryCode?: CountryCode;
  }
): Promise<string | null> {
  const buyerIdentity: Record<string, unknown> = {
    email: null,
    customerAccessToken: "",
    phone: null,
    countryCode: null,
  };
  if (options.email) buyerIdentity.email = options.email;
  if (options.customerAccessToken)
    buyerIdentity.customerAccessToken = options.customerAccessToken;
  if (options.phone) buyerIdentity.phone = options.phone;
  if (options.countryCode) buyerIdentity.countryCode = options.countryCode;

  const variables = {
    cartId,
    buyerIdentity,
  };

  try {
    const response = await shopifyServerFetch<UpdateCustomerIdentityResponse>(
      UPDATE_CUSTOMER_IDENTITY_MUTATION,
      variables
    );

    if (!response?.cartBuyerIdentityUpdate?.cart) {
      console.error(
        "Failed to update customer identity:",
        response?.cartBuyerIdentityUpdate?.userErrors
      );
      return null;
    }

    return response.cartBuyerIdentityUpdate.cart.checkoutUrl;
  } catch (error) {
    console.error("Error updating customer identity:", error);
    return null;
  }
}

const UPDATE_CART_LOCALIZATION_MUTATION = `
  mutation cartLocalizationUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
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

interface UpdateCartLocalizationResponse {
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
}

export async function updateCartLocalization(
  cartId: string,
  options: {
    country?: CountryCode;
    language?: LocaleLanguagesUpperCase;
  }
): Promise<string | null> {
  const countryCode = options.country || "LU";
  const languageCode = options.language || "EN";

  const buyerIdentity: Record<string, unknown> = {};
  if (options.country) buyerIdentity.countryCode = options.country;

  const variables = {
    cartId,
    buyerIdentity,
    country: countryCode,
    language: languageCode,
  };

  try {
    const response = await shopifyServerFetch<UpdateCartLocalizationResponse>(
      UPDATE_CART_LOCALIZATION_MUTATION,
      variables
    );

    if (!response?.cartBuyerIdentityUpdate?.cart) {
      console.error(
        "Failed to update cart localization:",
        response?.cartBuyerIdentityUpdate?.userErrors
      );
      return null;
    }

    return response.cartBuyerIdentityUpdate.cart.checkoutUrl;
  } catch (error) {
    console.error("Error updating cart localization:", error);
    return null;
  }
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

interface CartLinesAddResponse {
  [key: string]: {
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
}

export type CartOperation =
  | { type: "add"; variantId: string; quantity: number }
  | { type: "update"; lineId: string; quantity: number }
  | { type: "remove"; lineIds: string[] };

export async function updateCheckoutLines(
  cartId: string,
  operation: CartOperation,
  options: {
    country?: CountryCode;
    language?: LanguageCode;
  } = {}
): Promise<CartLinesAddResponse[string]["cart"] | null> {
  const country = options.country || "LU";
  const language = options.language || "EN";

  let mutation = "";
  const variables: {
    cartId: string;
    country: CountryCode | "LU";
    language: LanguageCode | "EN";
    lines?: Array<Record<string, unknown>>;
    lineIds?: string[];
  } = {
    cartId,
    country,
    language,
  };

  switch (operation.type) {
    case "add":
      mutation = CART_LINES_ADD_MUTATION;
      variables.lines = [
        {
          merchandiseId: operation.variantId,
          quantity: operation.quantity,
        },
      ];
      break;

    case "update":
      mutation = CART_LINES_UPDATE_MUTATION;
      variables.lines = [
        {
          id: operation.lineId,
          quantity: operation.quantity,
        },
      ];
      break;

    case "remove":
      mutation = CART_LINES_REMOVE_MUTATION;
      variables.lineIds = operation.lineIds;
      break;
  }

  try {
    const response = await shopifyServerFetch<CartLinesAddResponse>(
      mutation,
      variables
    );

    const responseKey = Object.keys(response)[0];
    const result = response[responseKey as keyof typeof response];

    if (result.userErrors.length > 0)
      console.error("Cart Update Error:", result.userErrors);

    return result.cart;
  } catch (error) {
    console.error("Error updating checkout lines:", error);
    return null;
  }
}