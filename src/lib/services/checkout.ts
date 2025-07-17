import { shopifyServerFetch } from "../shopify/server";

const CREATE_CART = `
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

export async function createCheckout(variantId: string, quantity = 1) {
  const variables = {
    cartInput: {
      lines: [
        {
          quantity,
          merchandiseId: variantId,
        },
      ],
    },
    country: "FR",     // optionally detect with getBuyerCountry()
    language: "FR",    // optionally detect with getPreferredLocale()
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
  }>(CREATE_CART, variables);

  return data.cartCreate.cart.checkoutUrl;
}