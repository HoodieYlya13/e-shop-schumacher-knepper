import ResetPassword from '@/components/Pages/ResetPassword/ResetPassword';
import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';

export default function ResetPasswordPage() {
  return (
    <PageBuilder showFooter={false} >
      <ResetPassword />
    </PageBuilder>
  );
}