"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  LoginSchema,
  RegisterValues,
  LoginValues,
  PasswordRecoveryValue,
  PasswordRecoverySchema,
} from "@/schemas/authSchema";
import React, { useEffect, useState } from "react";
import { authSubmitHandler } from "@/utils/auth/authSubmitHandler";

export type Mode = "REGISTER" | "LOGIN" | "PASSWORD_RECOVERY";
export type FormValues = RegisterValues | LoginValues | PasswordRecoveryValue;

export function useAuthForm() {
  const router = useRouter();
  const [mode, setMode] = React.useState<'REGISTER' | 'LOGIN' | 'PASSWORD_RECOVERY'>('LOGIN');
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
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    criteriaMode: "all",
  });

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

  function triggerVerification(
    watchedField: unknown,
    confirmField: keyof RegisterValues
  ) {
    useEffect(() => {
      if (
        mode === "REGISTER" &&
        (touchedFields as Partial<RegisterValues>)[confirmField]
      ) {
        trigger(confirmField);
      }
    }, [mode, watchedField, touchedFields, trigger]);
  }
  
  const email = watch("email");
  triggerVerification(email, "confirmEmail");
  
  const password = watch("password");
  triggerVerification(password, "confirmPassword");

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
        setMode
      )
    ),
    watch,
    errors,
    isSubmitting,
    isSubmitted,
    isValid,
    setError,
    clearErrors,
    reset,
    getValues,
    successMessage,
    mode,
    setMode,
  };
}