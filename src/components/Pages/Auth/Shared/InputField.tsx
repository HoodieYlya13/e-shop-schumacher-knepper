"use client";

import React, { useEffect, useRef, useState } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorText?: string;
  focusOnMount?: boolean;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(({
  type,
  placeholder,
  errorText = undefined,
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
        {...rest}
      />
      {showError && errorText && (
        <p className="text-sm text-red-600">{errorText}</p>
      )}
    </>
  );
});

InputField.displayName = "InputField";

export default InputField;