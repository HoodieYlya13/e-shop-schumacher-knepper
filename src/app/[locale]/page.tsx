import { getTranslations } from 'next-intl/server';
import { shopifyServerFetch } from '@/lib/shopify/server';

const QUERY = `
  query {
    shop {
      name
    }
  }
`;

export default async function HomePage() {
  const t = await getTranslations('HOME_PAGE');

  const data = await shopifyServerFetch<{ shop: { name: string } }>(QUERY);

  return (
    <main>
      <h1>{t('WELCOME', { name: data.shop.name })}</h1>
    </main>
  );
}