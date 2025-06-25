'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ModeSwitch from '@/components/Auth/ModeSwitch';
import SubmitButton from '@/components/Auth/SubmitButton';
import SignUp from '@/components/Auth/SignUp';
import SignIn from '@/components/Auth/SignIn';
import { useAuthForm } from '@/hooks/useAuthForm';

export default function AuthPage() {
  const t = useTranslations('AUTH');
  const router = useRouter();
  const form = useAuthForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    form.setSubmitted(true);
    form.setApiErrors({});

    if (!form.isFormValid || form.isBlockedByApiError) return;

    const requestBody: Record<string, any> = {
      mode: form.mode,
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      acceptsMarketing: form.acceptsMarketing,
      ...(form.phone.trim() && { phone: form.phone.trim() }),
    };

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const json = await res.json();

      if (!res.ok || (form.mode === 'REGISTER' && !json.customerCreate)) {
        form.setApiErrors({ generic: 'GENERIC' });
        return;
      }

      if (form.mode === 'LOGIN') {
        const token = json?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
        const loginError = json?.customerAccessTokenCreate?.customerUserErrors?.[0]?.message;

        if (token) {
          localStorage.setItem('shopify_token', token);
          router.push('/account');
        } else {
          form.setApiErrors({
            loginErrorMessage: loginError ? "LOGIN_ERROR" : "GENERIC",
          });
        }

        return;
      }

      const regErrors = json.customerCreate.customerUserErrors as {
        field: string[];
        code: string;
      }[];

      const newErrors: Record<string, string> = {};
      const newValues: Record<string, string> = {};

      regErrors?.forEach(({ field, code }) => {
        const key = field?.[1];
        if (key === 'email') {
          newErrors.email = 'EMAIL_TAKEN';
          newValues.email = form.email;
        } else if (key === 'phone' && code === 'TAKEN') {
          newErrors.phone = 'PHONE_TAKEN';
          newValues.phone = form.phone;
        } else if (code) {
          newErrors.generic = code;
        }
      });

      form.setApiErrors(newErrors);
      form.setErrorValues(newValues);

      if (Object.keys(newErrors).length > 0) return;

      const loginRes = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ mode: 'LOGIN', email: form.email, password: form.password }),
      });

      const loginJson = await loginRes.json();
      const loginToken = loginJson?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

      if (loginToken) {
        localStorage.setItem('shopify_token', loginToken);
        router.push('/account');
      } else {
        form.setMode('LOGIN');
        form.setApiErrors({ authentificationProblem: 'AUTHENTIFICATION_PROBLEM' });
      }

    } catch (err) {
      form.setApiErrors(err instanceof Error ? { generic: err.message } : { generic: 'GENERIC' });
    }
  };

  return (
    <main className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
      <h1 className="text-2xl font-bold">{t(form.mode)}</h1>

      <ModeSwitch mode={form.mode} setMode={form.setMode} setApiErrors={form.setApiErrors} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {form.mode === "REGISTER" ? <SignUp {...form} /> : <SignIn {...form} />}

        <SubmitButton
          disabled={!form.isFormValid || form.isBlockedByApiError}
          label={form.mode === "REGISTER" ? t("CREATE_ACCOUNT") : t("LOGIN")}
          isBlockedByApiError={form.isBlockedByApiError}
        />

        {form.apiErrors.loginErrorMessage && (
          <p className="text-red-600">
            {t(`ERRORS.${form.apiErrors.loginErrorMessage}`)}
          </p>
        )}

        {form.apiErrors.generic && (
          <p className="text-red-600">{t(`ERRORS.${form.apiErrors.generic}`)}</p>
        )}
      </form>
    </main>
  );
}