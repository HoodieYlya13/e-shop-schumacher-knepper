"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface ModeSwitchProps {
  mode: string;
  handleModeChange: (newMode: "LOGIN" | "REGISTER" | "PASSWORD_RECOVERY") => void;
}

export default function ModeSwitch({ mode, handleModeChange }: ModeSwitchProps) {
  const t = useTranslations('AUTH');

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleModeChange("LOGIN")}
        className={`px-4 py-2 rounded ${
          mode === "LOGIN" ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        {t("LOGIN")}
      </button>
      <button
        onClick={() => handleModeChange("REGISTER")}
        className={`px-4 py-2 rounded ${
          mode === "REGISTER" ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        {t("REGISTER")}
      </button>
    </div>
  );
}