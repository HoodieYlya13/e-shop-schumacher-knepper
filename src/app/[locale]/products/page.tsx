import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import Products from '@/components/Pages/Products/Products';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageBuilder>
      <Products locale={locale} />
    </PageBuilder>
  );
}