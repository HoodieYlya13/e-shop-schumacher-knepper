import Auth from '@/components/Pages/Auth/Auth';
import PageBuilder from '@/components/PageBuilder/PageBuilder';

export default function AuthPage() {
  return (
    <PageBuilder showFooter={false} >
      <Auth />
    </PageBuilder>
  );
}