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
  NewPasswordValues,
  NewPasswordSchema,
} from "@/schemas/authSchema";
import React, { useEffect, useState } from "react";
import { authSubmitHandler } from "@/utils/auth/authSubmitHandler";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/account/getAccessToken";

export type Mode = "REGISTER" | "LOGIN" | "PASSWORD_RECOVERY" | "NEW_PASSWORD";
export type FormValues = RegisterValues | LoginValues | PasswordRecoveryValue | NewPasswordValues;

export function useAuthForm() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.push("/account");
      return;
    }
  }, [router]);

  const [mode, setMode] = useState<Mode>("LOGIN");
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
      case "NEW_PASSWORD":
        return NewPasswordSchema;
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
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);

    if (!searchParams.has("reset_url")) return;

    const rawResetUrl = searchParams.get("reset_url");

    if (!rawResetUrl || rawResetUrl.trim() === "") {
      setMode("PASSWORD_RECOVERY");
      setError("root", { message: "LINK_UNAVAILABLE" });
      return;
    }

    const match = rawResetUrl.match(/\/account\/reset\/(\d+)\/([a-z0-9\-]+)/i);
    if (match) {
      setMode("NEW_PASSWORD");
      setValue("email", "dummy@example.com");
      setValue("resetUrl", rawResetUrl);
    } else {
      setMode("PASSWORD_RECOVERY");
      setError("root", { message: "LINK_UNAVAILABLE" });
    }
  }, [setError, setValue]);

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
    confirmField: keyof RegisterValues | keyof NewPasswordValues
  ) {
    useEffect(() => {
      if (
        (mode === "REGISTER" &&
          (touchedFields as Partial<RegisterValues>)[confirmField as keyof RegisterValues]) ||
        (mode === "NEW_PASSWORD" &&
          (touchedFields as Partial<NewPasswordValues>)[confirmField as keyof NewPasswordValues])
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