import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import { LocaleLanguages, LocaleLanguagesUpperCase } from '@/i18n/utils';
import { Product } from '@shopify/hydrogen-react/storefront-api-types';
import { getAllProducts, getProductsForFullSearch } from '@/lib/services/store-front/products';
import AllProducts from '@/components/Pages/Products/shared/AllProducts';

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
  let products: Product[] = [];

  if (searchTerm) products = await getProductsForFullSearch(searchTerm, language);
  else products = await getAllProducts(language);

  console.log('Products:', products);

  return (
    <PageBuilder>
      <AllProducts locale={locale} products={products} />
    </PageBuilder>
  );
}