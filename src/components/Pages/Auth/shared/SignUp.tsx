import { useTranslations } from "next-intl";
import { FieldErrors, FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import Input from "../../../UI/shared/elements/Input";
import { RegisterValues } from "@/schemas/authSchema";
import { CountryCode } from "libphonenumber-js/core";
import { getCustomerCountryClient } from "@/utils/shared/getters/getCustomerCountryClient";

interface SignUpProps {
  register: UseFormRegister<RegisterValues>;
  setValue: UseFormSetValue<FieldValues>;
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
        label={`${t("PHONE")}`}
        optionalTag
        name="phone"
        setValue={setValue}
        errorText={errors.phone && t(`ERRORS.${errors.phone.message}`)}
        required={false}
        autoComplete="tel"
        defaultCountry={(getCustomerCountryClient() || "LU") as CountryCode}
      />

      <Input
        type="checkbox"
        defaultChecked
        {...register("acceptsMarketing")}
        label={t("ACCEPTS_MARKETING")}
        optionalTag
        required={false}
        id="acceptsMarketing"
      />
    </>
  );
}