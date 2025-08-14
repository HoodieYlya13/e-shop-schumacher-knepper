import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import { LocaleLanguages, LocaleLanguagesUpperCase } from '@/i18n/utils';
import Product from '@/components/Pages/Products/Product';
import { getSingleProduct } from '@/lib/services/store-front/products';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: LocaleLanguages; handle: string }>;
}) {
  const { locale, handle } = await params;
  const language = locale.toUpperCase() as LocaleLanguagesUpperCase;

  const product = await getSingleProduct(handle, language);

  if (!product) {
    return (
      <PageBuilder>
        <p>Product not found.</p>
      </PageBuilder>
    );
  }

  return (
    <PageBuilder>
      <Product product={product} />
    </PageBuilder>
  );
}