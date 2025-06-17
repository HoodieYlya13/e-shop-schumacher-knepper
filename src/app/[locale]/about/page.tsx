import { getTranslations } from 'next-intl/server';

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: 'ABOUT_PAGE' });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{t('TITLE')}</h1>
      <p className="mt-2 text-gray-700">{t('DESCRIPTION')}</p>
    </div>
  );
}