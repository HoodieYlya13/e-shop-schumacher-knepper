import { useTranslations } from "next-intl";
import InputField from "../../../UI/Shared/InputField";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { PasswordRecoverValue } from "@/schemas/authSchema";

interface PasswordRecoverProps {
  register: UseFormRegister<PasswordRecoverValue>;
  errors: FieldErrors<PasswordRecoverValue>;
  successText?: string | null;
}

export default function PasswordRecover({ register, errors, successText }: PasswordRecoverProps) {
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
