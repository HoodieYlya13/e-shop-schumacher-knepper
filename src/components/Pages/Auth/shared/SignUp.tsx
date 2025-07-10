import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import Input from "../../../UI/shared/elements/Input";
import { RegisterValues } from "@/schemas/authSchema";
import { CountryCode } from "libphonenumber-js/core";
import { getBuyerCountry } from "@/utils/shared/getters/getBuyerCountry";

interface SignUpProps {
  register: UseFormRegister<RegisterValues>;
  setValue?: UseFormSetValue<RegisterValues>;
  errors: FieldErrors<RegisterValues>;
}

export default function SignUp({ register, setValue, errors }: SignUpProps) {
  const t = useTranslations("AUTH");

  return (
    <>
      <Input
        type="email"
        label={t("EMAIL")}
        {...register("email")}
        errorText={errors.email && t(`ERRORS.${errors.email.message}`)}
        autoComplete="email"
        focusOnMount
      />

      <Input
        type="email"
        label={t("CONFIRM_EMAIL")}
        {...register("confirmEmail")}
        errorText={
          errors.confirmEmail && t(`ERRORS.${errors.confirmEmail.message}`)
        }
        autoComplete="email"
      />

      <Input
        type="password"
        label={t("PASSWORD")}
        {...register("password")}
        errorText={errors.password && t(`ERRORS.${errors.password.message}`)}
        autoComplete="new-password"
      />

      <Input
        type="password"
        label={t("CONFIRM_PASSWORD")}
        {...register("confirmPassword")}
        errorText={
          errors.confirmPassword &&
          t(`ERRORS.${errors.confirmPassword.message}`)
        }
        autoComplete="new-password"
      />

      <Input
        type="text"
        label={`${t("FIRST_NAME")}`}
        {...register("firstName")}
        errorText={errors.firstName && t(`ERRORS.${errors.firstName.message}`)}
        autoComplete="given-name"
      />

      <Input
        type="text"
        label={`${t("LAST_NAME")}`}
        {...register("lastName")}
        errorText={errors.lastName && t(`ERRORS.${errors.lastName.message}`)}
        autoComplete="family-name"
      />

      <Input
        type="tel"
        label={`${t("PHONE")} (${t("OPTIONAL")})`}
        {...register("phone")}
        errorText={errors.phone && t(`ERRORS.${errors.phone.message}`)}
        // required={false}
        autoComplete="tel"
        setValue={setValue}
        defaultCountry={(getBuyerCountry() || "LU") as CountryCode}
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