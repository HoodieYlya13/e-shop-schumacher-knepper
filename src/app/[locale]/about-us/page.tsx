import PageLayout from "@/components/UI/PageLayout/PageLayout";
import { getShopAboutUs } from "@/lib/services/store-front/shop";

export default async function AboutUsPage() {
  const aboutUsContent = await getShopAboutUs();

  return (
    <PageLayout>
      <h1 className="mb-5 text-2xl">{aboutUsContent?.title}</h1>
      <div className="space-y-8">
        {aboutUsContent?.articles?.map((article, index) => (
          <section key={index} className="space-y-4">
            <h2 className="text-xl font-semibold">{article.title}</h2>

            {article?.paragraphs?.map((p: string, index: number) => (
              <p key={index} className="leading-relaxed whitespace-pre-line">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
