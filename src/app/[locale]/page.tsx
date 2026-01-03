import PageLayout from "@/components/UI/PageLayout/PageLayout";
import Home from "@/components/Pages/Home/Home";
import { LocaleLanguages } from "@/i18n/utils";

export default async function HomePage(props: {
  params: Promise<{ locale: LocaleLanguages }>;
}) {
  const { locale } = await props.params;

  return (
    <PageLayout padding={false}>
      <Home locale={locale} />
    </PageLayout>
  );
}
