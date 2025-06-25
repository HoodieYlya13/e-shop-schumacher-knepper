"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface SubmitButtonProps {
  disabled: boolean;
  label: string;
  isBlockedByApiError: boolean;
}

export default function SubmitButton({ disabled, label, isBlockedByApiError }: SubmitButtonProps) {
  const t = useTranslations("AUTH");

  return (
    <>
      <button
        type="submit"
        disabled={disabled}
        className={`w-full py-2 rounded ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-black text-white"
        }`}
      >
        {label}
      </button>
      {isBlockedByApiError && (
        <p className="text-sm text-red-500">
          {t("ERRORS.CORRECT_FIELDS_BEFORE_RESUBMIT")}
        </p>
      )}
    </>
  );
}