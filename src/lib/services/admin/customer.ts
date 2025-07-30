import { shopifyAdminFetch } from '@/lib/shopify/admin/server';
import { defaultLocale, LocaleLanguages } from '@/i18n/utils';

type AdminCustomer = {
  id: string;
  locale: string | null;
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

export async function customerUpdateLocale(id: string, locale: LocaleLanguages = defaultLocale): Promise<AdminCustomer> {
  const variables = {
    input: {
      id,
      locale
    },
  };

  const data = await shopifyAdminFetch<{
    customerUpdate: {
      customer: AdminCustomer;
    };
  }>(CUSTOMER_UPDATE_LOCALE_MUTATION, variables);

  return data.customerUpdate.customer;
}