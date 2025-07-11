"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  LoginSchema,
  RegisterValues,
  LoginValues,
  PasswordRecoveryValue,
  PasswordRecoverySchema,
  ResetPasswordValues,
  ResetPasswordSchema,
} from "@/schemas/authSchema";
import React, { useEffect, useState } from "react";
import { authSubmitHandler } from "@/utils/auth/handlers/authSubmitHandler";
import { useRouter } from "next/navigation";

export type Mode = "REGISTER" | "LOGIN" | "PASSWORD_RECOVERY" | "RESET_PASSWORD";
export type FormValues = RegisterValues | LoginValues | PasswordRecoveryValue | ResetPasswordValues;

type AuthFormProps = {
  initialMode: Mode;
  resetPasswordUrl?: string;
};

export function useAuthForm({ initialMode, resetPasswordUrl }: AuthFormProps) {
  const router = useRouter();

  const resetMode =
    typeof window !== "undefined" &&
    document.cookie.includes("resetPasswordMode=true");
  const [mode, setMode] = useState<Mode>(initialMode);
  const [validateOnChangeFields, setValidateOnChangeFields] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const schema = (() => {
    switch (mode) {
      case "REGISTER":
        return RegisterSchema;
      case "LOGIN":
        return LoginSchema;
      case "PASSWORD_RECOVERY":
        return PasswordRecoverySchema;
      case "RESET_PASSWORD":
        return ResetPasswordSchema;
      default:
        throw new Error("Invalid mode");
    }
  })();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting, isSubmitted, isValid, touchedFields },
    reset,
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: mode === "LOGIN" ? "onChange" : "onBlur",
    criteriaMode: "all",
  });

  useEffect(() => {
    if (mode === "RESET_PASSWORD" && resetPasswordUrl) {
      setValue("email", "dummy@example.com");
      setValue("resetUrl", resetPasswordUrl);
    } else if (initialMode === "PASSWORD_RECOVERY") {
      setError("root", { message: "LINK_UNAVAILABLE" });
    }
  }, [mode, resetMode, resetPasswordUrl, setError, setValue, initialMode]);

  const customRegister = (name: keyof FormValues) => {
    const base = register(name);

    return {
      ...base,
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        base.onBlur(e);
        setValidateOnChangeFields((prev) => new Set(prev).add(name));
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        base.onChange(e);
        if (validateOnChangeFields.has(name)) {
          trigger(name);
        }
      },
    };
  };

  useEffect(() => {
    setValidateOnChangeFields(new Set());
  }, [mode]);

  function useTriggerVerification(
    watchedField: unknown,
    confirmField: keyof RegisterValues | keyof ResetPasswordValues
  ) {
    useEffect(() => {
      if (
        (mode === "REGISTER" &&
          (touchedFields as Partial<RegisterValues>)[confirmField as keyof RegisterValues]) ||
        (mode === "RESET_PASSWORD" &&
          (touchedFields as Partial<ResetPasswordValues>)[confirmField as keyof ResetPasswordValues])
      ) {
        trigger(confirmField);
      }
    }, [watchedField, confirmField]);
  }
  
  const email = watch("email");
  useTriggerVerification(email, "confirmEmail");
  
  const password = watch("password");
  useTriggerVerification(password, "confirmPassword");

  return {
    register: customRegister,
    handleSubmit: handleSubmit((data) =>
      authSubmitHandler(
        data,
        mode,
        clearErrors,
        setError,
        router,
        setSuccessMessage,
        setMode,
        false,
        setValue
      )
    ),
    errors,
    isSubmitting,
    isSubmitted,
    isValid,
    setError,
    clearErrors,
    reset,
    getValues,
    setValue,
    successMessage,
    mode,
    setMode,
  };
}