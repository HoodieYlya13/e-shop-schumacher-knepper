import { useTranslations } from "next-intl";
import InputField from "../../../UI/shared/InputField";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { PasswordRecoveryValue } from "@/schemas/authSchema";

interface PasswordRecoveryProps {
  register: UseFormRegister<PasswordRecoveryValue>;
  errors: FieldErrors<PasswordRecoveryValue>;
  successText?: string | null;
}

export default function PasswordRecovery({ register, errors, successText }: PasswordRecoveryProps) {
  const t = useTranslations("AUTH");

  return (
    <InputField
      type="email"
      placeholder={t("EMAIL")}
      {...register("email")}
      successText={successText ? t(successText) : undefined}
      errorText={errors.email && t(`ERRORS.${errors.email.message}`)}
      focusOnMount
    />
  );
}
