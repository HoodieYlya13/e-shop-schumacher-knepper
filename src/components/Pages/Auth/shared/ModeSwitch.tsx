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
    <div className="flex gap-4 text-primary">
      <button
        onClick={() => handleModeChange("LOGIN")}
        className={clsx(
          "px-4 py-2 rounded border",
          mode === "LOGIN"
            ? "bg-secondary border-accent"
            : "bg-primary text-secondary border-light"
        )}
      >
        {t("LOGIN")}
      </button>
      <button
        onClick={() => handleModeChange("REGISTER")}
        className={clsx(
          "px-4 py-2 rounded border",
          mode === "REGISTER"
            ? "bg-secondary border-accent"
            : "bg-primary text-secondary border-light"
        )}
      >
        {t("REGISTER")}
      </button>
    </div>
  );
}