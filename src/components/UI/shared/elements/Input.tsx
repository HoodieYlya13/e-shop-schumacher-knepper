"use client";

import { RegisterValues } from "@/schemas/authSchema";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-number-input";
import { UseFormSetValue } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password" | "number" | "tel";
  placeholder?: string;
  successText?: string;
  errorText?: string;
  required?: boolean;
  focusOnMount?: boolean;
  setValue?: UseFormSetValue<RegisterValues>;
}

const CustomPhoneInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { focusOnMount?: boolean }
>(({ value, onChange, onBlur, onFocus, focusOnMount, ...props }, ref) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const combinedRef = (node: HTMLInputElement | null) => {
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.RefObject<HTMLInputElement | null>).current = node;
    internalRef.current = node;
  };

  useEffect(() => {
    if (focusOnMount && internalRef.current) {
      internalRef.current.focus();
    }
  }, [focusOnMount]);
  return (
    <input
      ref={combinedRef}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      {...props}
      className="flex-grow px-2 border-none outline-none"
    />
  );
});

CustomPhoneInput.displayName = "CustomPhoneInput";

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  type,
  placeholder,
  successText,
  errorText,
  required = true,
  focusOnMount = false,
  setValue,
  ...rest
}, ref) => {
  const [showError, setShowError] = useState(false);
  const [value, setValueState] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);

  const internalRef = useRef<HTMLInputElement>(null);
  const combinedRef = (node: HTMLInputElement | null) => {
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = node;
    internalRef.current = node;
  };

  useEffect(() => {
    if (!errorText) {
      setShowError(false);
      return;
    }

    const timeout = setTimeout(() => {
      setShowError(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [errorText]);

  useEffect(() => {
    if (focusOnMount && internalRef.current) {
      internalRef.current.focus();
    }
  }, [focusOnMount]);

  useEffect(() => {
    if (type === "tel" && setValue) {
      setValue("phone", value || "", { shouldValidate: true });
    }
  }, [value, type, setValue]);

  if (type === "tel") {
    return (
      <>
        <PhoneInput
          className={clsx("w-full p-2 border rounded", {
            "border-red-500": !!errorText && touched,
          })}
          international
          defaultCountry="FR"
          inputComponent={CustomPhoneInput}
          value={value}
          onChange={setValueState}
          onBlur={(e) => {
            setTouched(true);
            rest.onBlur?.(e as React.FocusEvent<HTMLInputElement>);
          }}
          autoComplete={rest.autoComplete}
          focusOnMount={focusOnMount}
        />
        {successText && <p className="text-sm text-green-600">{successText}</p>}
        {showError && errorText && touched && (
          <p className="text-sm text-red-600">{errorText}</p>
        )}
      </>
    );
  }

  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className={clsx("w-full p-2 border rounded", {
          "border-red-500": !!errorText,
        })}
        ref={combinedRef}
        autoComplete={rest.autoComplete}
        {...rest}
      />
      {successText && <p className="text-sm text-green-600">{successText}</p>}
      {showError && errorText && (
        <p className="text-sm text-red-600">{errorText}</p>
      )}
    </>
  );
});

Input.displayName = "Input";

export default Input;