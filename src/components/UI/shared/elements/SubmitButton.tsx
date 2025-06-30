"use client";

import React from "react";

interface SubmitButtonProps {
  label: string;
  error?: string;
  disabled?: boolean;
}

export default function SubmitButton({ label, error, disabled }: SubmitButtonProps) {
  return (
    <>
      <button
        type="submit"
        disabled={disabled || !!error}
        className={`w-full py-2 rounded cursor-pointer ${
          disabled || !!error
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-black text-white"
        }`}
      >
        {label}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </>
  );
}