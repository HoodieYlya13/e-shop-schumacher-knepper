import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import { getShopAboutUs } from '@/lib/services/store-front/shop';

export default async function AboutUsPage() {
  const aboutUsContent = await getShopAboutUs();
  
  return (
    <PageBuilder>
      {aboutUsContent.content}
    </PageBuilder>
  );
}