import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import Products from '@/components/Pages/Products/Products';
import { LocaleLanguages } from '@/i18n/utils';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: LocaleLanguages }>;
}) {
  const { locale } = await params;

  return (
    <PageBuilder>
      <Products locale={locale} />
    </PageBuilder>
  );
}