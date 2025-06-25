import { getTranslations } from 'next-intl/server';

export default async function About({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'ABOUT_PAGE' });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{t("TITLE")}</h1>
      <p className="mt-2 text-gray-700">{t("DESCRIPTION")}</p>
    </div>
  );
}