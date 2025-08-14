import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import Products from '@/components/Pages/Products/Products';
import { LocaleLanguages, LocaleLanguagesUpperCase } from '@/i18n/utils';
import { Product } from '@shopify/hydrogen-react/storefront-api-types';
import { getAllProducts, getProductsForFullSearch } from '@/lib/services/store-front/products';

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { locale: LocaleLanguages };
  searchParams: { search?: string };
}) {
  const { locale } = await params;
  const { search } = await searchParams;

  const language = locale.toUpperCase() as LocaleLanguagesUpperCase;
  let products: Product[] = [];

  if (search) products = await getProductsForFullSearch(search, language);
  else products = await getAllProducts(language);
  
  return (
    <PageBuilder>
      <Products locale={locale} products={products} />
    </PageBuilder>
  );
}