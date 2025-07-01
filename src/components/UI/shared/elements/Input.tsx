"use client";

import React, { useEffect, useRef, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password" | "number" | "tel";
  placeholder?: string;
  successText?: string;
  errorText?: string;
  required?: boolean;
  focusOnMount?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  type,
  placeholder,
  successText,
  errorText,
  required = true,
  focusOnMount = false,
  ...rest
}, ref) => {
  const [showError, setShowError] = useState(false);

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
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className={`w-full p-2 border rounded ${!!errorText ? "border-red-500" : ""}`}
        ref={combinedRef}
        autoComplete={rest.autoComplete}
        {...rest}
      />
      {successText && (
        <p className="text-sm text-green-600">{successText}</p>
      )}
      {showError && errorText && (
        <p className="text-sm text-red-600">{errorText}</p>
      )}
    </>
  );
});

Input.displayName = "Input";

export default Input;