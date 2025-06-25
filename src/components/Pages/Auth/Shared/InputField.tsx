"use client";

import React from "react";

interface InputFieldProps {
    type: string;
    value: string;
    setter: (value: string) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    placeholder?: string;
    isInvalid?: boolean;
    errorText?: string;
    required?: boolean;
}

export default function InputField({
  type,
  value,
  setter,
  onBlur,
  placeholder,
  isInvalid,
  errorText,
  required = true,
}: InputFieldProps) {
  return (
    <>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          setter(e.target.value);
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        className={`w-full p-2 border rounded ${isInvalid ? "border-red-500" : ""}`}
      />
      {isInvalid && errorText && (
        <p className="text-sm text-red-600">{errorText}</p>
      )}
    </>
  );
}