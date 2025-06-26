"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface ModeSwitchProps {
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<"LOGIN" | "REGISTER">>;
  clearErrors: () => void;
}

export default function ModeSwitch({ mode, setMode, clearErrors }: ModeSwitchProps) {
  const t = useTranslations('AUTH');
  const switchMode = (newMode: "LOGIN" | "REGISTER") => {
    setMode(newMode);
    clearErrors();
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => switchMode("LOGIN")}
        className={`px-4 py-2 rounded ${
          mode === "LOGIN" ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        {t("LOGIN")}
      </button>
      <button
        onClick={() => switchMode("REGISTER")}
        className={`px-4 py-2 rounded ${
          mode === "REGISTER" ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        {t("REGISTER")}
      </button>
    </div>
  );
}