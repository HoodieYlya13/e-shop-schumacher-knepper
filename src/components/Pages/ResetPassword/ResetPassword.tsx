"use client";

import Form from "@/components/UI/shared/components/Form";
import InputField from "@/components/UI/shared/elements/InputField";
import { useResetPasswordForm } from "@/hooks/auth/useResetPasswordForm";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ResetPassword() {
  const router = useRouter();
  const t = useTranslations("AUTH");

  const searchParams = new URLSearchParams(window.location.search);
  const resetUrl = searchParams.get("reset_url");

  if (!resetUrl) {
    // FIXME - This should be handled more gracefully, e.g., showing an error message
    router.push("/auth");
    return null;
  }

  let customerId: string | null = null;
  let resetToken: string | null = null;

  if (resetUrl) {
    const match = resetUrl.match(/\/account\/reset\/(\d+)\/([a-z0-9\-]+)/i);
    if (match) {
      customerId = match[1];
      resetToken = match[2];
    }
    console.log(customerId, resetToken);
  }

  if (!customerId || !resetToken) {
    // FIXME - add router.push("/auth");
    return (
      <section className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
        <h1 className="text-2xl font-bold">{t("RESET_PASSWORD_ERROR")}</h1>
        <p>{t("RESET_PASSWORD_INVALID_LINK")}</p>
      </section>
    );
  }

  const form = useResetPasswordForm();

  useEffect(() => {
    if (customerId && resetToken) {
      form.setValue("customerId", customerId);
      form.setValue("resetToken", resetToken);
    }
  }, [customerId, resetToken]);

  return (
    <section className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
      <h1 className="text-2xl font-bold">{t("RESET_PASSWORD")}</h1>

      <Form handleSubmit={form.handleSubmit} buttonProps={{ label: "Reset" }}>
        <InputField
          type="password"
          placeholder={t("PASSWORD")}
          {...form.register("password")}
          errorText={
            form.errors.password && t(`ERRORS.${form.errors.password.message}`)
          }
          autoComplete="new-password"
        />

        <InputField
          type="password"
          placeholder={t("CONFIRM_PASSWORD")}
          {...form.register("confirmPassword")}
          errorText={
            form.errors.confirmPassword &&
            t(`ERRORS.${form.errors.confirmPassword.message}`)
          }
          autoComplete="new-password"
        />

        <pre className="text-xs text-gray-500">
          {JSON.stringify(form.watch(), null, 2)}
        </pre>
      </Form>
    </section>
  );
}