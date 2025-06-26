"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface SubmitButtonProps {
  label: string;
  errors: boolean;
  disabled?: boolean;
}

export default function SubmitButton({ label, errors, disabled }: SubmitButtonProps) {
  const t = useTranslations("AUTH");

  return (
    <>
      <button
        type="submit"
        disabled={disabled || errors}
        className={`w-full py-2 rounded ${
          disabled || errors
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-black text-white"
        }`}
      >
        {label}
      </button>
      {errors && (
        <p className="text-sm text-red-500">
          {t("ERRORS.CORRECT_FIELDS_BEFORE_SUBMIT")}
        </p>
      )}
    </>
  );
}