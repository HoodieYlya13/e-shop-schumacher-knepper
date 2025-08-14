import { LocaleLanguages } from "@/i18n/utils";
import { Product } from "@shopify/hydrogen-react/storefront-api-types";
import AllProducts from "./shared/AllProducts";

export default async function Products({
  locale,
  products
}: {
  locale: LocaleLanguages;
  products: Product[]
}) {
  return <AllProducts locale={locale} products={products} />;
}