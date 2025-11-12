"use client";

import { useTranslations } from "next-intl";
import ModeSwitch from "./shared/ModeSwitch";
import SignUp from "./shared/SignUp";
import SignIn from "./shared/SignIn";
import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { LoginValues, ResetPasswordValues, PasswordRecoveryValue, RegisterValues } from "@/schemas/authSchema";
import { Mode, useAuthForm } from "@/hooks/auth/useAuthForm";
import PasswordRecovery from "./shared/PasswordRecovery";
import Form from "@/components/UI/shared/components/Form";
import ResetPassword from "./shared/ResetPassword";

interface AuthProps {
  initialMode: Mode;
  resetPasswordUrl?: string;
};

export default function Auth({ initialMode, resetPasswordUrl }: AuthProps) {  
  const t = useTranslations('AUTH');
  const form = useAuthForm({ initialMode, resetPasswordUrl });

  const handleModeChange = (newMode: Mode) => {
    form.reset(form.getValues());
    if (form.mode === "RESET_PASSWORD") form.setValue("email", "");;
    form.setMode(newMode);
  }

  return (
    <section className="bg-secondary sm:bg-transparent flex flex-1 w-full justify-center sm:items-center p-5 md:p-10 pt-26 md:py-36">
      <div className="max-w-lg w-full h-fit mx-auto p-6 space-y-6 rounded-4xl shadow-lg shadow-accent/30 backdrop-blur-md bg-light/50 outline outline-accent/50">
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
                    PASSWORD_RECOVERY: "PASSWORD_RECOVERY",
                    RESET_PASSWORD: "RESET_PASSWORD",
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
              (form.mode !== "LOGIN" &&
                form.mode !== "PASSWORD_RECOVERY" &&
                Object.keys(form.errors).length > 0) ||
              Object.entries(form.getValues())
                .filter(
                  ([key]) => key !== "acceptsMarketing" && key !== "phone"
                )
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
                    setValue={
                      form.setValue as unknown as UseFormSetValue<FieldValues>
                    }
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
              case "RESET_PASSWORD":
                return (
                  <ResetPassword
                    register={
                      form.register as UseFormRegister<ResetPasswordValues>
                    }
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
      </div>
    </section>
  );
}