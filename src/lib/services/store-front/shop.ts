import { shopifyServerFetch } from '@/lib/shopify/store-front/server';

const GET_SHOP_NAME_QUERY = `
  query {
    shop {
      name
    }
  }
`;

export async function getShopName() {
  const data = await shopifyServerFetch<{ shop: { name: string } }>(GET_SHOP_NAME_QUERY, undefined);
  return data.shop.name;
}