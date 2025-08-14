import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import Products from '@/components/Pages/Products/Products';
import { LocaleLanguages } from '@/i18n/utils';

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { locale: LocaleLanguages };
  searchParams: { search?: string };
}) {
  return (
    <PageBuilder>
      <Products params={params} searchParams={searchParams} />
    </PageBuilder>
  );
}