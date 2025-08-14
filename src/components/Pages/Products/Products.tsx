import { LocaleLanguages, LocaleLanguagesUpperCase } from "@/i18n/utils";
import { getAllProducts, getProductsForFullSearch } from "@/lib/services/store-front/products";
import { Product } from "@shopify/hydrogen-react/storefront-api-types";
import AllProducts from "./shared/AllProducts";

export default async function Products({
  params,
  searchParams,
}: {
  params: Promise<{ locale: LocaleLanguages }>;
  searchParams?: Promise<{ search?: string }>;
}) {
  const { locale } = await params;
  const { search: searchTerm } = (await searchParams) || {};
  const language = locale.toUpperCase() as LocaleLanguagesUpperCase;
  let products: Product[] = [];

  if (searchTerm) products = await getProductsForFullSearch(searchTerm, language);
  else products = await getAllProducts(language);

  return <AllProducts locale={locale} products={products} />;
}