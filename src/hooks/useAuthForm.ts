"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAuthForm() {
  const router = useRouter();

  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [errorValues, setErrorValues] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<'REGISTER' | 'LOGIN'>('REGISTER');
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);

  const isPhoneValid = phone.trim() === '' || /^\+?[0-9]{7,15}$/.test(phone.trim());
  const isPasswordValid = password.length >= 5;
  const isEmailMatch = email === confirmEmail;
  const isPasswordMatch = password === confirmPassword;

  const isFormValid =
    mode === 'LOGIN'
      ? email && password
      : email && password && firstName && lastName &&
        isPhoneValid && isPasswordValid && isEmailMatch && isPasswordMatch;

  const fieldTouched = useCallback(
    (name: string) => touched[name] || submitted,
    [touched, submitted]
  );

  const isFieldInvalid = useCallback(
    (field: string): boolean => {
      if (field === "email") {
        return (
          apiErrors.email === "EMAIL_TAKEN" && email === errorValues.email
        ) || (submitted && email.trim() === "");
      }
      if (field === "phone") {
        return (
          (apiErrors.phone === "PHONE_TAKEN" && phone === errorValues.phone) ||
          (fieldTouched("phone") && !isPhoneValid)
        );
      }
      return false;
    },
    [apiErrors, errorValues, email, phone, submitted, isPhoneValid, fieldTouched]
  );

  const isBlockedByApiError =
    (apiErrors.email === 'EMAIL_TAKEN' && email === errorValues.email) ||
    (apiErrors.phone === 'PHONE_TAKEN' && phone === errorValues.phone);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      setApiErrors({});

      if (!isFormValid || isBlockedByApiError) return;

      const requestBody: Record<string, any> = {
        mode,
        email,
        password,
        firstName,
        lastName,
        acceptsMarketing,
        ...(phone.trim() && { phone: phone.trim() }),
      };

      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          body: JSON.stringify(requestBody),
        });

        const json = await res.json();

        if (!res.ok || (mode === "REGISTER" && !json.customerCreate)) {
          setApiErrors({ generic: "GENERIC" });
          return;
        }

        if (mode === "LOGIN") {
          const token = json?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
          const loginError = json?.customerAccessTokenCreate?.customerUserErrors?.[0]?.message;

          if (token) {
            localStorage.setItem("shopify_token", token);
            router.push("/account");
          } else {
            setApiErrors({
              loginErrorMessage: loginError ? "LOGIN_ERROR" : "GENERIC",
            });
          }

          return;
        }

        const regErrors = json.customerCreate.customerUserErrors as {
          field: string[];
          code: string;
        }[];

        const newErrors: Record<string, string> = {};
        const newValues: Record<string, string> = {};

        regErrors?.forEach(({ field, code }) => {
          const key = field?.[1];
          if (key === "email") {
            newErrors.email = "EMAIL_TAKEN";
            newValues.email = email;
          } else if (key === "phone" && code === "TAKEN") {
            newErrors.phone = "PHONE_TAKEN";
            newValues.phone = phone;
          } else if (code) {
            newErrors.generic = code;
          }
        });

        setApiErrors(newErrors);
        setErrorValues(newValues);

        if (Object.keys(newErrors).length > 0) return;

        const loginRes = await fetch("/api/auth", {
          method: "POST",
          body: JSON.stringify({ mode: "LOGIN", email, password }),
        });

        const loginJson = await loginRes.json();
        const loginToken = loginJson?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

        if (loginToken) {
          localStorage.setItem("shopify_token", loginToken);
          router.push("/account");
        } else {
          setMode("LOGIN");
          setApiErrors({
            authentificationProblem: "AUTHENTIFICATION_PROBLEM",
          });
        }

      } catch (err) {
        setApiErrors(
          err instanceof Error
            ? { generic: err.message }
            : { generic: "GENERIC" }
        );
      }
    },
    [
      mode,
      email,
      password,
      firstName,
      lastName,
      phone,
      acceptsMarketing,
      isFormValid,
      isBlockedByApiError,
      router
    ]
  );

  return {
    mode, setMode,
    submitted, setSubmitted,
    apiErrors, setApiErrors,
    errorValues, setErrorValues,
    email, setEmail,
    confirmEmail, setConfirmEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    firstName, setFirstName,
    lastName, setLastName,
    phone, setPhone,
    acceptsMarketing, setAcceptsMarketing,
    touched, setTouched,
    isPhoneValid,
    isPasswordValid,
    isEmailMatch,
    isPasswordMatch,
    isFormValid,
    isBlockedByApiError,
    isFieldInvalid,
    fieldTouched,
    handleSubmit,
  };
}