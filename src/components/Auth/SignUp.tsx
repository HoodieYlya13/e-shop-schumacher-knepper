import { useTranslations } from "next-intl";
import InputField from "./InputField";

interface SignUpProps {
  email: string;
  setEmail: (value: string) => void;
  confirmEmail: string;
  setConfirmEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  acceptsMarketing: boolean;
  setAcceptsMarketing: (value: boolean) => void;
  setTouched: (callback: (touched: Record<string, boolean>) => Record<string, boolean>) => void;
  isFieldInvalid: (field: string) => boolean;
  fieldTouched: (field: string) => boolean;
  isPhoneValid: boolean;
  isPasswordValid: boolean;
  isEmailMatch: boolean;
  isPasswordMatch: boolean;
  apiErrors: Record<string, string>;
  errorValues: Record<string, string>;
}

export default function SignUp({
  email,
  setEmail,
  confirmEmail,
  setConfirmEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  acceptsMarketing,
  setAcceptsMarketing,
  setTouched,
  isFieldInvalid,
  fieldTouched,
  isPhoneValid,
  isPasswordValid,
  isEmailMatch,
  isPasswordMatch,
  apiErrors,
  errorValues,
}: SignUpProps) {
  const t = useTranslations("AUTH");

    return (
      <>
        <InputField
          type="email"
          value={email}
          setter={setEmail}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder={t("EMAIL")}
          isInvalid={isFieldInvalid("email")}
          errorText={
            apiErrors.email === "EMAIL_TAKEN" && email === errorValues.email
              ? t("ERRORS.EMAIL_TAKEN")
              : undefined
          }
        />

        <InputField
          type="email"
          value={confirmEmail}
          setter={setConfirmEmail}
          onBlur={() => setTouched((t) => ({ ...t, confirmEmail: true }))}
          placeholder={t("CONFIRM_EMAIL")}
          isInvalid={fieldTouched("confirmEmail") && !isEmailMatch}
          errorText={
            fieldTouched("confirmEmail") && confirmEmail && !isEmailMatch
              ? t("ERRORS.EMAIL_MISMATCH")
              : undefined
          }
        />

        <InputField
          type="password"
          value={password}
          setter={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          placeholder={t("PASSWORD")}
          isInvalid={fieldTouched("password") && !isPasswordValid}
          errorText={
            fieldTouched("password") && !isPasswordValid
              ? t("ERRORS.TOO_SHORT")
              : undefined
          }
        />

        <InputField
          type="password"
          value={confirmPassword}
          setter={setConfirmPassword}
          onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
          placeholder={t("CONFIRM_PASSWORD")}
          isInvalid={fieldTouched("confirmPassword") && !isPasswordMatch}
          errorText={
            fieldTouched("confirmPassword") &&
            confirmPassword &&
            !isPasswordMatch
              ? t("ERRORS.PASSWORD_MISMATCH")
              : undefined
          }
        />

        <InputField
          type="text"
          value={firstName}
          setter={setFirstName}
          placeholder={t("FIRST_NAME")}
        />

        <InputField
          type="text"
          value={lastName}
          setter={setLastName}
          placeholder={t("LAST_NAME")}
        />

        <InputField
          type="tel"
          value={phone}
          setter={setPhone}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          placeholder={`${t("PHONE")} (${t("OPTIONAL")})`}
          isInvalid={isFieldInvalid("phone")}
          errorText={
            apiErrors.phone === "PHONE_TAKEN" && phone === errorValues.phone
              ? t("ERRORS.PHONE_TAKEN")
              : fieldTouched("phone") && !isPhoneValid ?
                t("ERRORS.INVALID")
                : undefined
          }
          required={false}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={acceptsMarketing}
            onChange={(e) => setAcceptsMarketing(e.target.checked)}
          />
          <span>{t("ACCEPTS_MARKETING")}</span>
        </label>
      </>
    );
}