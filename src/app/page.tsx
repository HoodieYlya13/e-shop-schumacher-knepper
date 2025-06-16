import { shopifyServerFetch } from '@/lib/shopify/server-side-query';

const QUERY = `
  query {
    shop {
      name
    }
  }
`;

export default async function Home() {
  const data = await shopifyServerFetch<{ shop: { name: string } }>(QUERY);

  return <h1>{`Welcome to ${data.shop.name}'s store!`}</h1>;
}