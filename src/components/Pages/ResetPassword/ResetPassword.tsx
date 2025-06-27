"use client";

import { useResetPasswordForm } from "@/hooks/auth/useResetPasswordForm";
import { useTranslations } from "next-intl";
import React from "react";

export default function ResetPassword() {
  const t = useTranslations('AUTH');
  const form = useResetPasswordForm("resetPassword", "resetPassword");

  return (
    <section className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold">{t("RESET_PASSWORD")}</h1>
      </form>
    </section>
  );
}