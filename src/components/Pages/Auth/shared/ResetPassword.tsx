"use client";

import InputField from "@/components/UI/shared/elements/Input";
import { NewPasswordValues } from "@/schemas/authSchema";
import { useTranslations } from "next-intl";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface ResetPasswordProps {
  register: UseFormRegister<NewPasswordValues>;
  errors: FieldErrors<NewPasswordValues>;
}

export default function ResetPassword({
  register,
  errors,
}: ResetPasswordProps) {
  const t = useTranslations("AUTH");

  return (
    <>
      <InputField
        type="password"
        placeholder={t("PASSWORD")}
        {...register("password")}
        errorText={
          errors.password && t(`ERRORS.${errors.password.message}`)
        }
        autoComplete="new-password"
      />

      <InputField
        type="password"
        placeholder={t("CONFIRM_PASSWORD")}
        {...register("confirmPassword")}
        errorText={
          errors.confirmPassword &&
          t(`ERRORS.${errors.confirmPassword.message}`)
        }
        autoComplete="new-password"
      />
    </>
  );
}