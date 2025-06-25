import PageBuilder from '@/components/PageBuilder/PageBuilder';
import About from '@/components/Pages/About/About';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageBuilder>
      <About locale={locale} />
    </PageBuilder>
  );
}