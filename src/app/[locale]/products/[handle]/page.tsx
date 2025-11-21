import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import { LocaleLanguages, LocaleLanguagesUpperCase } from '@/i18n/utils';
import Product from '@/components/Pages/Products/Product';
import { getSingleProduct } from '@/lib/services/store-front/products';
import { getCustomerCountryServer } from '@/utils/shared/getters/getCustomerCountryServer';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: LocaleLanguages; handle: string }>;
}) {
  const { locale, handle } = await params;
  const language = locale.toUpperCase() as LocaleLanguagesUpperCase;
  const country = await getCustomerCountryServer();

  const product = await getSingleProduct(handle, language, country);

  if (!product)
    return (
      <PageBuilder>
        <p>Product not found.</p>
      </PageBuilder>
    );

  return (
    <PageBuilder>
      <Product locale={locale} product={product} />
    </PageBuilder>
  );
}