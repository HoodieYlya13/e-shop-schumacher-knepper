"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface ModeSwitchProps {
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<"LOGIN" | "REGISTER">>;
  setApiErrors: (errors: Record<string, any>) => void;
}

export default function ModeSwitch({ mode, setMode, setApiErrors }: ModeSwitchProps) {
  const t = useTranslations('AUTH');

  return (
    <div className="flex gap-4">
      <button
        onClick={() => {
          setMode("REGISTER");
          setApiErrors({});
        }}
        className={`px-4 py-2 rounded ${
          mode === "REGISTER" ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        {t("REGISTER")}
      </button>
      <button
        onClick={() => {
          setMode("LOGIN");
          setApiErrors({});
        }}
        className={`px-4 py-2 rounded ${
          mode === "LOGIN" ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        {t("LOGIN")}
      </button>
    </div>
  );
}