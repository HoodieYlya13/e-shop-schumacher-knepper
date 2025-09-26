import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import Home from '@/components/Pages/Home/Home';
import { LocaleLanguages } from '@/i18n/utils';

export default async function HomePage(props: {
  params: Promise<{ locale: LocaleLanguages }>;
}) {
  const { locale } = await props.params;

  return (
    <PageBuilder padding={false}>
      <Home locale={locale} />
    </PageBuilder>
  );
}