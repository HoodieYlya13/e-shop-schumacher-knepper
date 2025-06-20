import AllProducts from '@/components/AllProducts';
import PageBuilder from '@/components/PageBuilder/PageBuilder';

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <PageBuilder>
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
    </PageBuilder>
  );
}