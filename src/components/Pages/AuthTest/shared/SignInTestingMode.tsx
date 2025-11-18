import { useTranslations } from "next-intl";
import Input from "../../../UI/shared/elements/Input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { LoginTestingModeValues } from "@/schemas/authTestingModeSchema";

interface SignInTestingModeProps {
  register: UseFormRegister<LoginTestingModeValues>;
  errors: FieldErrors<LoginTestingModeValues>;
}

export default function SignInTestingMode({ register, errors }: SignInTestingModeProps) {
  const t = useTranslations("AUTH");

  return (
    <Input
      type="password"
      label={t("PASSWORD")}
      requiredTag={false}
      {...register("password")}
      errorText={errors.password && t(`ERRORS.${errors.password.message}`)}
      autoComplete="current-password"
    />
  );
}