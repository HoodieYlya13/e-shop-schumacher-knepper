"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  LoginSchema,
  RegisterValues,
  LoginValues,
} from "@/schemas/authSchema";
import { useEffect, useState } from "react";
import { handleAuthSubmit } from "@/utils/auth/authSubmitHandler";

export type Mode = "REGISTER" | "LOGIN";
export type FormValues = RegisterValues | LoginValues;

export function useAuthForm(mode: Mode) {
  const router = useRouter();
  const [validateOnChangeFields, setValidateOnChangeFields] = useState<Set<string>>(new Set());

  const schema = mode === "REGISTER" ? RegisterSchema : LoginSchema;

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting, isSubmitted, isValid, touchedFields },
    setError,
    clearErrors,
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

  const email = watch("email");
  useEffect(() => {
    if (
      mode === "REGISTER" &&
      "confirmEmail" in touchedFields &&
      touchedFields.confirmEmail
    ) {
      trigger("confirmEmail");
    }
  }, [mode, email, touchedFields, trigger]);

  const password = watch("password");
  useEffect(() => {
    if (
      mode === "REGISTER" &&
      "confirmPassword" in touchedFields &&
      touchedFields.confirmPassword
    ) {
      trigger("confirmPassword");
    }
  }, [mode, password, touchedFields, trigger]);

  useEffect(() => {
    setValidateOnChangeFields(new Set());
  }, [mode]);

  return {
    register: customRegister,
    handleSubmit: handleSubmit((data) =>
      handleAuthSubmit(data, mode, clearErrors, setError, router)
    ),
    errors,
    isSubmitting,
    isSubmitted,
    isValid,
    clearErrors,
  };
}