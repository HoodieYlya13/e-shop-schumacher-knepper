import { LocaleLanguages, LocaleLanguagesUpperCase } from "@/i18n/utils";
import { getAllProducts } from "@/lib/services/store-front/products";
import { Product } from "@shopify/hydrogen-react/storefront-api-types";
import AllProducts from "./shared/AllProducts";

export default async function Products({ locale }: { locale: LocaleLanguages }) {
  const products: Product[] = await getAllProducts(locale.toUpperCase() as LocaleLanguagesUpperCase);

  console.log("Products:", products);
  return (
    <>
      <AllProducts locale={locale} products={products} />
    </>
  );
}