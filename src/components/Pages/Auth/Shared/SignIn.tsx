import { useTranslations } from "next-intl";
import InputField from "./InputField";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { LoginValues } from "@/schemas/authSchema";

interface SignInProps {
  register: UseFormRegister<LoginValues>;
  errors: FieldErrors<LoginValues>;
}

export default function SignIn({ register, errors }: SignInProps) {
  const t = useTranslations("AUTH");

  return (
    <>
      <InputField
        type="email"
        placeholder={t("EMAIL")}
        {...register("email")}
        errorText={errors.email && t(`ERRORS.${errors.email.message}`)}
        focusOnMount
      />

      <InputField
        type="password"
        placeholder={t("PASSWORD")}
        {...register("password")}
        errorText={errors.password && t(`ERRORS.${errors.password.message}`)}
      />
    </>
  );
}