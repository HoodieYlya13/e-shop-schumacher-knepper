import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputField from "../../../UI/Shared/InputField";
import { RegisterValues } from "@/schemas/authSchema";

interface SignUpProps {
  register: UseFormRegister<RegisterValues>;
  errors: FieldErrors<RegisterValues>;
}

export default function SignUp({ register, errors }: SignUpProps) {
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
        type="email"
        placeholder={t("CONFIRM_EMAIL")}
        {...register("confirmEmail")}
        errorText={
          errors.confirmEmail && t(`ERRORS.${errors.confirmEmail.message}`)
        }
      />

      <InputField
        type="password"
        placeholder={t("PASSWORD")}
        {...register("password")}
        errorText={errors.password && t(`ERRORS.${errors.password.message}`)}
      />

      <InputField
        type="password"
        placeholder={t("CONFIRM_PASSWORD")}
        {...register("confirmPassword")}
        errorText={
          errors.confirmPassword &&
          t(`ERRORS.${errors.confirmPassword.message}`)
        }
      />

      <InputField
        type="text"
        placeholder={t("FIRST_NAME")}
        {...register("firstName")}
        errorText={errors.firstName && t(`ERRORS.${errors.firstName.message}`)}
      />

      <InputField
        type="text"
        placeholder={t("LAST_NAME")}
        {...register("lastName")}
        errorText={errors.lastName && t(`ERRORS.${errors.lastName.message}`)}
      />

      <InputField
        type="tel"
        placeholder={`${t("PHONE")} (${t("OPTIONAL")})`}
        {...register("phone")}
        errorText={errors.phone && t(`ERRORS.${errors.phone.message}`)}
        required={false}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          defaultChecked
          {...register("acceptsMarketing")}
        />
        <span>{t("ACCEPTS_MARKETING")}</span>
      </label>
    </>
  );
}