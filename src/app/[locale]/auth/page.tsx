import Auth from '@/components/Pages/Auth/Auth';
import PageBuilder from '@/components/UI/PageBuilder/PageBuilder';
import { getAccessToken } from '@/utils/shared/getters/getAccessToken';
import { getResetPasswordUrl } from '@/utils/auth/getters/getResetPasswordUrl';
import { getInitialAuthMode } from '@/utils/auth/getters/getInitialAuthMode';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const token = await getAccessToken();
  if (token) {
    redirect("/account");
  }
  const initialMode = await getInitialAuthMode();
  const resetPasswordUrl = await getResetPasswordUrl();
  return (
    <PageBuilder showFooter={false} >
      <Auth initialMode={initialMode} resetPasswordUrl={resetPasswordUrl} />
    </PageBuilder>
  );
}