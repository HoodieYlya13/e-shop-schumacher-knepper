import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputField from "../../../UI/shared/elements/InputField";
import { NewPasswordValues } from "@/schemas/authSchema";

interface NewPasswordProps {
  register: UseFormRegister<NewPasswordValues>;
  errors: FieldErrors<NewPasswordValues>;
}

export default function NewPassword({ register, errors }: NewPasswordProps) {
  const t = useTranslations("AUTH");

  return (
    <>
      <InputField
        type="password"
        placeholder={t("PASSWORD")}
        {...register("password")}
        errorText={errors.password && t(`ERRORS.${errors.password.message}`)}
        autoComplete="new-password"
      />

      <InputField
        type="password"
        placeholder={t("CONFIRM_PASSWORD")}
        {...register("confirmPassword")}
        errorText={
          errors.confirmPassword &&
          t(`ERRORS.${errors.confirmPassword.message}`)
        }
        autoComplete="new-password"
      />
    </>
  );
}