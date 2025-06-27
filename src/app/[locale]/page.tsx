import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import Home from '@/components/Pages/Home/Home';

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <PageBuilder>
      <Home locale={locale} />
    </PageBuilder>
  );
}