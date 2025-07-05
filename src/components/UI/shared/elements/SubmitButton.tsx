"use client";

import clsx from "clsx";
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
        disabled={disabled}
        className={clsx(
          "w-full py-2 rounded cursor-pointer",
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-black text-white"
        )}
      >
        {label}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </>
  );
}