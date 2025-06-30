"use client";

import { useTranslations } from "next-intl";
import React from "react";
import ModeSwitch from "./shared/ModeSwitch";
import SignUp from "./shared/SignUp";
import SignIn from "./shared/SignIn";
import { UseFormRegister } from "react-hook-form";
import { LoginValues, PasswordRecoveryValue, RegisterValues } from "@/schemas/authSchema";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import PasswordRecovery from "./shared/PasswordRecovery";
import Form from "@/components/UI/shared/components/Form";

export default function Auth() {
  const t = useTranslations('AUTH');
  const handleModeChange = (newMode: 'REGISTER' | 'LOGIN' | 'PASSWORD_RECOVERY') => {
    form.reset(form.getValues());
    form.setMode(newMode);
  }
  const form = useAuthForm();

  return (
    <section className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow">
      <h1 className="text-2xl font-bold">{t(form.mode)}</h1>

      <ModeSwitch mode={form.mode} handleModeChange={handleModeChange} />

      <Form
        handleSubmit={form.handleSubmit}
        buttonProps={{
          label: t(
            form.isSubmitting
              ? "LOADING"
              : {
                  REGISTER: "CREATE_ACCOUNT",
                  LOGIN: "LOGIN",
                  PASSWORD_RECOVERY: "RESET_PASSWORD",
                  NEW_PASSWORD: "SET_NEW_PASSWORD",
                }[form.mode]
          ),
          error:
            form.isSubmitted &&
            Object.keys(form.errors).some((key) => key !== "root")
              ? t("ERRORS.CORRECT_FIELDS_BEFORE_SUBMIT")
              : undefined,
          disabled: form.isSubmitting,
        }}
        errors={form.errors.root}
      >
        {(() => {
          switch (form.mode) {
            case "REGISTER":
              return (
                <SignUp
                  register={form.register as UseFormRegister<RegisterValues>}
                  errors={form.errors}
                />
              );
            case "PASSWORD_RECOVERY":
              return (
                <PasswordRecovery
                  register={
                    form.register as UseFormRegister<PasswordRecoveryValue>
                  }
                  errors={form.isSubmitted ? form.errors : {}}
                  successText={form.successMessage}
                  email={form.getValues("email")}
                />
              );
            default:
              return (
                <SignIn
                  register={form.register as UseFormRegister<LoginValues>}
                  errors={form.isSubmitted ? form.errors : {}}
                  handleModeChange={handleModeChange}
                />
              );
          }
        })()}
      </Form>
    </section>
  );
}