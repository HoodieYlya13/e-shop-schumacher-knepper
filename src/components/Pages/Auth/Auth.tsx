"use client";

import { useTranslations } from "next-intl";
import React from "react";
import ModeSwitch from "./Shared/ModeSwitch";
import SignUp from "./Shared/SignUp";
import SignIn from "./Shared/SignIn";
import SubmitButton from "./Shared/SubmitButton";
import { UseFormRegister } from "react-hook-form";
import { LoginValues, RegisterValues } from "@/schemas/authSchema";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import NonFieldErrors from "./Shared/NonFieldErrors";

export default function Auth() {
  const t = useTranslations('AUTH');
  const [mode, setMode] = React.useState<'REGISTER' | 'LOGIN'>('LOGIN');
  const form = useAuthForm(mode);

  return (
    <section className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
      <h1 className="text-2xl font-bold">{t(mode)}</h1>

      <ModeSwitch
        mode={mode}
        setMode={setMode}
        clearErrors={form.clearErrors}
      />

      <form onSubmit={form.handleSubmit} className="space-y-4">
        {mode === "REGISTER" ? (
          <SignUp
            register={form.register as UseFormRegister<RegisterValues>}
            errors={form.errors}
          />
        ) : (
          <SignIn
            register={form.register as UseFormRegister<LoginValues>}
            errors={form.isSubmitted ? form.errors : {}}
          />
        )}

        <SubmitButton
          label={
            form.isSubmitting
              ? t("LOADING")
              : t(mode === "REGISTER" ? "CREATE_ACCOUNT" : "LOGIN")
          }
          errors={
            form.isSubmitted &&
            Object.keys(form.errors).some((key) => key !== "root")
          }
          disabled={form.isSubmitting}
        />

        {form.errors.root && <NonFieldErrors errors={form.errors.root} />}
      </form>
    </section>
  );
}