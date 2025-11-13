import { useTranslations } from "next-intl";
import Input from "../../../UI/shared/elements/Input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { LoginValues } from "@/schemas/authSchema";
import Button from "@/components/UI/shared/elements/Button";

interface SignInProps {
  register: UseFormRegister<LoginValues>;
  errors: FieldErrors<LoginValues>;
  handleModeChange: (newMode: "LOGIN" | "REGISTER" | "PASSWORD_RECOVERY") => void;
}

export default function SignIn({ register, errors, handleModeChange }: SignInProps) {
  const t = useTranslations("AUTH");

  return (
    <>
      <Input
        type="email"
        label={t("EMAIL")}
        requiredTag={false}
        {...register("email")}
        errorText={errors.email && t(`ERRORS.${errors.email.message}`)}
        focusOnMount
        autoComplete="email"
      />

      <Input
        type="password"
        label={t("PASSWORD")}
        requiredTag={false}
        {...register("password")}
        errorText={errors.password && t(`ERRORS.${errors.password.message}`)}
        autoComplete="current-password"
      />

      <div className="flex justify-end text-sm text-accent">
        <Button
          onClick={() => handleModeChange("PASSWORD_RECOVERY")}
          child={t("FORGOT_PASSWORD")}
          variant="link"
        />
      </div>
    </>
  );
}