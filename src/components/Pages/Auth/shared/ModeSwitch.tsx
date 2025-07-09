"use client";

import { Mode } from "@/hooks/auth/useAuthForm";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import React from "react";

interface ModeSwitchProps {
  mode: string;
  handleModeChange: (newMode: Mode) => void;
}

export default function ModeSwitch({ mode, handleModeChange }: ModeSwitchProps) {
  const t = useTranslations('AUTH');

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleModeChange("LOGIN")}
        className={clsx(
          "px-4 py-2 rounded",
          mode === "LOGIN" ? "bg-black text-white" : "bg-gray-200"
        )}
      >
        {t("LOGIN")}
      </button>
      <button
        onClick={() => handleModeChange("REGISTER")}
        className={clsx(
          "px-4 py-2 rounded",
          mode === "REGISTER" ? "bg-black text-white" : "bg-gray-200"
        )}
      >
        {t("REGISTER")}
      </button>
    </div>
  );
}