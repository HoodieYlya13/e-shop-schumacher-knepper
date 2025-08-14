import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import { notFound } from 'next/navigation';
import { getSingleProduct } from '@/lib/services/store-front/products';
import { LocaleLanguages, LocaleLanguagesUpperCase } from '@/i18n/utils';

export default async function ProductPage({ params }: { params: Promise<{ locale: LocaleLanguages; handle: string }> }) {
  const { locale, handle } = await params;
  const product = await getSingleProduct(handle, locale.toUpperCase() as LocaleLanguagesUpperCase);

  console.log("Product:", product);
  
  if (!product) notFound();

  return (
    <PageBuilder>
        <div>test</div>
      {/* <Products locale={locale} /> */}
    </PageBuilder>
  );
}