import Auth from '@/components/Pages/Auth/Auth';
import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import { getCustomerAccessToken } from '@/utils/shared/getters/getCustomerAccessToken';
import { getResetPasswordUrl } from '@/utils/auth/getters/getResetPasswordUrl';
import { getInitialAuthMode } from '@/utils/auth/getters/getInitialAuthMode';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const customerAccessToken = await getCustomerAccessToken();
  if (customerAccessToken) redirect("/account");
  
  const initialMode = await getInitialAuthMode();
  const resetPasswordUrl = await getResetPasswordUrl();
  return (
    <PageBuilder showFooter={false}>
      <Auth initialMode={initialMode} resetPasswordUrl={resetPasswordUrl} />
    </PageBuilder>
  );
}