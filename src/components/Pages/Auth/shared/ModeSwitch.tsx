import Button from "@/components/UI/shared/elements/Button";
import { Mode } from "@/hooks/auth/useAuthForm";
import { useTranslations } from "next-intl";
import React from "react";

interface ModeSwitchProps {
  mode: Mode;
  handleModeChange: (newMode: Mode) => void;
}

export default function ModeSwitch({ mode, handleModeChange }: ModeSwitchProps) {
  const t = useTranslations('AUTH');
  const changeMode: Mode = mode === "LOGIN" ? "REGISTER" : "LOGIN";

  return (
    <Button
      onClick={() => handleModeChange(changeMode)}
      child={t("LOGIN")}
      child2={t(
        mode !== "RESET_PASSWORD" && mode !== "PASSWORD_RECOVERY"
          ? "REGISTER"
          : mode
      )}
      condition={mode === "LOGIN"}
      className="w-full"
    />
  );
}