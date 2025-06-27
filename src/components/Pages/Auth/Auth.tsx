"use client";

import { useTranslations } from "next-intl";
import React from "react";
import ModeSwitch from "./Shared/ModeSwitch";
import SignUp from "./Shared/SignUp";
import SignIn from "./Shared/SignIn";
import SubmitButton from "../../UI/Shared/SubmitButton";
import { UseFormRegister } from "react-hook-form";
import { LoginValues, PasswordRecoverValue, RegisterValues } from "@/schemas/authSchema";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import NonFieldErrors from "./Shared/NonFieldErrors";
import PasswordRecover from "./Shared/PasswordRecover";

export default function Auth() {
  const t = useTranslations('AUTH');
  const [mode, setMode] = React.useState<'REGISTER' | 'LOGIN' | 'PASSWORD_RECOVER'>('LOGIN');
  const handleModeChange = (newMode: 'REGISTER' | 'LOGIN' | 'PASSWORD_RECOVER') => {
    form.reset(form.getValues());
    setMode(newMode);
  }
  const form = useAuthForm(mode);

  return (
    <section className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
      <h1 className="text-2xl font-bold">{t(mode)}</h1>

      <ModeSwitch mode={mode} handleModeChange={handleModeChange} />

      <form onSubmit={form.handleSubmit} className="space-y-4">
        {(() => {
          switch (mode) {
            case "REGISTER":
              return (
                <SignUp
                  register={form.register as UseFormRegister<RegisterValues>}
                  errors={form.errors}
                />
              );
            case "LOGIN":
              return (
                <SignIn
                  register={form.register as UseFormRegister<LoginValues>}
                  errors={form.isSubmitted ? form.errors : {}}
                  handleModeChange={handleModeChange}
                />
              );
            default:
              return (
                <PasswordRecover
                  register={
                    form.register as UseFormRegister<PasswordRecoverValue>
                  }
                  errors={form.isSubmitted ? form.errors : {}}
                  successText={form.successMessage}
                />
              );
          }
        })()}

        <SubmitButton
          label={t(
            form.isSubmitting
              ? "LOADING"
              : {
                  REGISTER: "CREATE_ACCOUNT",
                  LOGIN: "LOGIN",
                  PASSWORD_RECOVER: "RESET_PASSWORD",
                }[mode]
          )}
          error={
            form.isSubmitted &&
            Object.keys(form.errors).some((key) => key !== "root")
              ? t("ERRORS.CORRECT_FIELDS_BEFORE_SUBMIT")
              : undefined
          }
          disabled={form.isSubmitting}
        />

        {form.errors.root && <NonFieldErrors errors={form.errors.root} />}
      </form>
    </section>
  );
}