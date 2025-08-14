import { shopifyServerFetch } from "@/lib/shopify/store-front/server";

const CREATE_CART_MUTATION = `
  mutation cartCreate($cartInput: CartInput!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    cartCreate(input: $cartInput) {
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

export async function createCheckout(
  options: {
    lineItems: Array<{
      variantId: string;
      quantity: number;
    }>;
    customerAccessToken?: string;
  }
) {
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
    country: "FR", // TODO: Make this dynamic based on user location or settings
    language: "FR",
  };

  const data = await shopifyServerFetch<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
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