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
  const child2: Mode =
    mode !== "RESET_PASSWORD" && mode !== "PASSWORD_RECOVERY"
      ? "REGISTER"
      : mode;

  return (
    <Button
      onClick={() => handleModeChange("LOGIN")}
      child={t("LOGIN")}
      child2={t(child2)}
      onClick2={() => handleModeChange(child2)}
      condition={mode === "LOGIN"}
      className="w-full"
      oneLiner
    />
  );
}