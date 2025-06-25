'use client';

import { useTranslations } from 'next-intl';
import ModeSwitch from '@/components/Pages/Auth/Shared/ModeSwitch';
import SubmitButton from '@/components/Pages/Auth/Shared/SubmitButton';
import SignUp from '@/components/Pages/Auth/Shared/SignUp';
import SignIn from '@/components/Pages/Auth/Shared/SignIn';
import { useAuthForm } from '@/hooks/useAuthForm';
import NonFieldErrors from '@/components/Pages/Auth/Shared/NonFieldErrors';

export default function Auth() {
  const t = useTranslations('AUTH');
  const form = useAuthForm();

  return (
    <section className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
      <h1 className="text-2xl font-bold">{t(form.mode)}</h1>

      <ModeSwitch mode={form.mode} setMode={form.setMode} setApiErrors={form.setApiErrors} />

      <form onSubmit={form.handleSubmit} className="space-y-4">
        {form.mode === "REGISTER" ? <SignUp {...form} /> : <SignIn {...form} />}

        <SubmitButton
          disabled={!form.isFormValid || form.isBlockedByApiError}
          label={form.mode === "REGISTER" ? t("CREATE_ACCOUNT") : t("LOGIN")}
          isBlockedByApiError={form.isBlockedByApiError}
        />

        <NonFieldErrors apiErrors={form.apiErrors} />
      </form>
    </section>
  );
}