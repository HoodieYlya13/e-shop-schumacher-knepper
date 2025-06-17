import AllProducts from '@/components/AllProducts';

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <main>
      <AllProducts locale={locale} />
    </main>
  );
}