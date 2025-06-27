import Auth from '@/components/Pages/Auth/Auth';
import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';

export default function AuthPage() {
  return (
    <PageBuilder showFooter={false} >
      <Auth />
    </PageBuilder>
  );
}