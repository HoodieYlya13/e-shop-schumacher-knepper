import { LocaleLanguagesUpperCase } from "@/i18n/utils";
import { getAllProducts } from "@/lib/services/store-front/products";
import { Product } from "@shopify/hydrogen-react/storefront-api-types";
import AllProducts from "../Home/shared/AllProducts";

export default async function Products({ locale }: { locale: string }) {
  const products: Product[] = await getAllProducts(locale.toUpperCase() as LocaleLanguagesUpperCase);
  return (
    <>
      <AllProducts products={products} />
      <AllProducts products={products} />
      <AllProducts products={products} />
      <AllProducts products={products} />
      <AllProducts products={products} />
      <AllProducts products={products} />
      <AllProducts products={products} />
      <AllProducts products={products} />
      <AllProducts products={products} />
    </>
  );
}