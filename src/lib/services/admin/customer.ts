import { shopifyAdminFetch } from "@/lib/shopify/admin/server";
import { DEFAULT_LOCALE, LocaleLanguages } from "@/i18n/utils";

type AdminCustomer = {
  id: string;
  locale: LocaleLanguages | null;
};

const CUSTOMER_UPDATE_LOCALE_MUTATION = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        locale
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function customerUpdateLocale(
  id: string,
  locale: LocaleLanguages = DEFAULT_LOCALE
): Promise<AdminCustomer | null> {
  try {
    const variables = {
      input: {
        id,
        locale,
      },
    };

    const response = await shopifyAdminFetch<{
      customerUpdate: {
        customer: AdminCustomer;
        userErrors: Array<{
          field: string[];
          message: string;
        }>;
      };
    }>(CUSTOMER_UPDATE_LOCALE_MUTATION, variables);

    if (response.customerUpdate?.userErrors?.length > 0) {
      console.error(
        "Error updating customer locale:",
        response.customerUpdate.userErrors
      );
      return null;
    }

    if (!response.customerUpdate?.customer) {
      console.error("Failed to update customer locale: No customer returned");
      return null;
    }

    return response.customerUpdate.customer;
  } catch (error) {
    console.error("Error updating customer locale:", error);
    return null;
  }
}
