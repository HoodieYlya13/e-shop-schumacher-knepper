import Auth from '@/components/Pages/Auth/Auth';
import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import { getCustomerAccessToken } from '@/utils/shared/getters/getCustomerAccessToken';
import { getResetPasswordUrl } from '@/utils/auth/getters/getResetPasswordUrl';
import { getInitialAuthMode } from '@/utils/auth/getters/getInitialAuthMode';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const customerAccessToken = await getCustomerAccessToken(true);
  if (customerAccessToken) redirect("/account");
  
  // TODO: Implement logic to use searchParams to determine initial mode and reset password URL
  const initialMode = await getInitialAuthMode();
  const resetPasswordUrl = await getResetPasswordUrl();
  return (
    <PageBuilder padding={false} showFooter={false} auroraBackground={true} fullScreen={false} >
      <Auth initialMode={initialMode} resetPasswordUrl={resetPasswordUrl} />
    </PageBuilder>
  );
}