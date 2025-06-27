"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema, NewPasswordValues } from "@/schemas/authSchema";
import { useEffect, useState } from "react";
import { resetPasswordHandler } from "@/utils/auth/resetPasswordHandler";

export function useResetPasswordForm(customerId: string, resetToken: string) {
  const router = useRouter();
  const [validateOnChangeFields, setValidateOnChangeFields] = useState<Set<string>>(new Set());

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
  } = useForm<NewPasswordValues>({
    resolver: zodResolver(NewPasswordSchema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const customRegister = (name: keyof NewPasswordValues) => {
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
  }, []);

  const password = watch("password");
  const confirmPassword = "confirmPassword" as const;

  useEffect(() => {
    if (touchedFields[confirmPassword]) {
      trigger(confirmPassword);
    }
  }, [password, touchedFields, trigger]);

  return {
    register: customRegister,
    handleSubmit: handleSubmit((data) =>
      resetPasswordHandler(
        {
          ...data,
          customerId,
          resetToken,
        },
        clearErrors,
        setError,
        router
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
  };
}