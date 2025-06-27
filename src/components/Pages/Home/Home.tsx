import AllProducts from '@/components/Pages/Home/sharedGit/AllProducts';

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