import AllProducts from '@/components/Pages/Home/Shared/AllProducts';

export default async function Home({ locale }: { locale: string }) {
  return (
    <>
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
      <AllProducts locale={locale} />
    </>
  );
}