"use client";

import { useState, useCallback } from "react";

export function useAuthForm() {
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

  return {
    mode,
    setMode,
    submitted,
    setSubmitted,
    apiErrors,
    setApiErrors,
    errorValues,
    setErrorValues,
    email,
    setEmail,
    confirmEmail,
    setConfirmEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    acceptsMarketing,
    setAcceptsMarketing,
    touched,
    setTouched,
    isPhoneValid,
    isPasswordValid,
    isEmailMatch,
    isPasswordMatch,
    isFormValid,
    isFieldInvalid,
    fieldTouched,
    isBlockedByApiError,
  };
}