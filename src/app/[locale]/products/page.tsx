import PageLayout from "@/components/UI/PageLayout/PageLayout";
import { LocaleLanguages, LocaleLanguagesUpperCase } from "@/i18n/utils";
import { Product } from "@shopify/hydrogen-react/storefront-api-types";
import {
  getAllProducts,
  getProductsForFullSearch,
} from "@/lib/services/store-front/products";
import AllProducts from "@/components/Pages/Products/shared/AllProducts";
import { getCustomerCountryServer } from "@/utils/shared/getters/getCustomerCountryServer";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: LocaleLanguages }>;
  searchParams?: Promise<{ search?: string }>;
}) {
  const { locale } = await params;
  const { search: searchTerm } = (await searchParams) || {};

  const language = locale.toUpperCase() as LocaleLanguagesUpperCase;
  const country = await getCustomerCountryServer();
  let products: Product[] = [];

  if (searchTerm)
    products = await getProductsForFullSearch(searchTerm, language, country);
  else products = await getAllProducts(language, country);

  return (
    <PageLayout>
      <AllProducts
        locale={locale}
        products={products}
        searchTerm={searchTerm}
      />
    </PageLayout>
  );
}
