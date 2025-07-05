"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ModeSwitch from "./shared/ModeSwitch";
import SignUp from "./shared/SignUp";
import SignIn from "./shared/SignIn";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { LoginValues, NewPasswordValues, PasswordRecoveryValue, RegisterValues } from "@/schemas/authSchema";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import PasswordRecovery from "./shared/PasswordRecovery";
import Form from "@/components/UI/shared/components/Form";
import ResetPassword from "./shared/ResetPassword";

export default function Auth() {  
  const t = useTranslations('AUTH');
  const form = useAuthForm();
  const [modeDefined, setModeDefined] = useState(false);

  useEffect(() => {
    if (form.mode) {
      setModeDefined(true);
    }
  }, [form.mode]);

  const handleModeChange = (newMode: 'REGISTER' | 'LOGIN' | 'PASSWORD_RECOVERY' | 'NEW_PASSWORD') => {
    form.reset(form.getValues());
    if (form.mode === "NEW_PASSWORD") {
      form.setValue("email", "");
    };
    form.setMode(newMode);
  }

  return (
    <section
      className="max-w-lg mx-auto p-6 space-y-6 border rounded shadow"
      style={{
        opacity: modeDefined ? 1 : 0,
        transition: "opacity 0.1s ease-in",
      }}
    >
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
          disabled:
            form.isSubmitting ||
            !!form.successMessage ||
            Object.keys(form.errors).length > 0 ||
            Object.entries(form.getValues())
              .filter(([key]) => key !== "acceptsMarketing")
              .every(([, value]) => !value),
        }}
        errors={form.errors.root}
      >
        {(() => {
          switch (form.mode) {
            case "REGISTER":
              return (
                <SignUp
                  register={form.register as UseFormRegister<RegisterValues>}
                  setValue={form.setValue as UseFormSetValue<RegisterValues>}
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
            case "NEW_PASSWORD":
              return (
                <ResetPassword
                  register={form.register as UseFormRegister<NewPasswordValues>}
                  errors={form.errors}
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