import { useTranslations } from "next-intl";
import InputField from "../../../UI/Shared/InputField";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { LoginValues } from "@/schemas/authSchema";

interface SignInProps {
  register: UseFormRegister<LoginValues>;
  errors: FieldErrors<LoginValues>;
  handleModeChange: (newMode: "LOGIN" | "REGISTER" | "PASSWORD_RECOVER") => void;
}

export default function SignIn({ register, errors, handleModeChange }: SignInProps) {
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

      <div className="flex justify-end text-sm">
        <button
          type="button"
          onClick={() => handleModeChange("PASSWORD_RECOVER")}
          className="text-blue-600 hover:underline"
        >
          {t("FORGOT_PASSWORD")}
        </button>
      </div>
    </>
  );
}