import PageLayout from "@/components/UI/PageLayout/PageLayout";
import { LocaleLanguages, LocaleLanguagesUpperCase } from "@/i18n/utils";
import Product from "@/components/Pages/Products/Product";
import { getSingleProduct } from "@/lib/services/store-front/products";
import { getCustomerCountryServer } from "@/utils/shared/getters/getCustomerCountryServer";

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
      <PageLayout>
        <p>Product not found.</p>
      </PageLayout>
    );

  return (
    <PageLayout>
      <Product locale={locale} product={product} />
    </PageLayout>
  );
}
