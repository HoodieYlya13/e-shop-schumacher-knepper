import PageLayout from "@/components/UI/PageLayout/PageLayout";
import { getShopGeneralPolicies } from "@/lib/services/store-front/shop";

export default async function GeneralTermsPage() {
  const generalTerms = await getShopGeneralPolicies();

  return (
    <PageLayout>
      <h1 className="mb-5 text-2xl">{generalTerms?.title}</h1>
      <div className="space-y-8">
        {generalTerms?.articles?.map((article, index) => (
          <section key={index} className="space-y-4">
            <h2 className="text-xl font-semibold">{article?.title}</h2>

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
