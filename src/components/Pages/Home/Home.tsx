import AllProducts from '@/components/Pages/Home/shared/AllProducts';
import { getAllProducts } from '@/lib/services/store-front/products';
import { Product } from '@shopify/hydrogen-react/storefront-api-types';

export default async function Home({ locale }: { locale: string }) {
  const products: Product[] = await getAllProducts(locale.toUpperCase() as "EN" | "FR" | "DE");
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