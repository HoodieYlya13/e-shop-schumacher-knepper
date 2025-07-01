import { useTranslations } from "next-intl";
import Input from "../../../UI/shared/elements/Input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { LoginValues } from "@/schemas/authSchema";

interface SignInProps {
  register: UseFormRegister<LoginValues>;
  errors: FieldErrors<LoginValues>;
  handleModeChange: (newMode: "LOGIN" | "REGISTER" | "PASSWORD_RECOVERY") => void;
  passwordsEnabled?: boolean;
}

export default function SignIn({ register, errors, handleModeChange, passwordsEnabled }: SignInProps) {
  const t = useTranslations("AUTH");

  return (
    <>
      <Input
        type="email"
        placeholder={t("EMAIL")}
        {...register("email")}
        errorText={errors.email && t(`ERRORS.${errors.email.message}`)}
        focusOnMount
        autoComplete="email"
      />

      {passwordsEnabled && (
        <>
          <Input
            type="password"
            placeholder={t("PASSWORD")}
            {...register("password")}
            errorText={
              errors.password && t(`ERRORS.${errors.password.message}`)
            }
            autoComplete="current-password"
          />

          <div className="flex justify-end text-sm">
            <button
              type="button"
              onClick={() => handleModeChange("PASSWORD_RECOVERY")}
              className="text-blue-600 hover:underline"
            >
              {t("FORGOT_PASSWORD")}
            </button>
          </div>
        </>
      )}
    </>
  );
}