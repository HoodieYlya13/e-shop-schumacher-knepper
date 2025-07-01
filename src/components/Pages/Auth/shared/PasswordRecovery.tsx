import { useTranslations } from "next-intl";
import InputField from "../../../UI/shared/elements/Input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { PasswordRecoveryValue } from "@/schemas/authSchema";
import { useMemo } from "react";

interface PasswordRecoveryProps {
  register: UseFormRegister<PasswordRecoveryValue>;
  errors: FieldErrors<PasswordRecoveryValue>;
  successText?: string | null;
  email?: string | null;
}

export default function PasswordRecovery({
  register,
  errors,
  successText,
  email,
}: PasswordRecoveryProps) {
  const t = useTranslations("AUTH");

  const emailProviderLink = useMemo(() => {
    if (!email) return null;

    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return null;

    const map: Record<string, { name: string; url: string }> = {
      "gmail.com": { name: "Gmail", url: "https://mail.google.com" },
      "yahoo.com": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
      "hotmail.com": { name: "Outlook", url: "https://outlook.live.com" },
      "outlook.com": { name: "Outlook", url: "https://outlook.live.com" },
      "live.com": { name: "Outlook", url: "https://outlook.live.com" },
      "icloud.com": { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
      "orange.fr": { name: "Orange Mail", url: "https://webmail.orange.fr" },
      "sfr.fr": { name: "SFR Mail", url: "https://webmail.sfr.fr" },
      "laposte.net": { name: "La Poste Mail", url: "https://www.laposte.net/accueil" },
      "free.fr": { name: "Free Mail", url: "https://webmail.free.fr" },
      "proton.me": { name: "Proton Mail", url: "https://mail.proton.me" },
    };

    return map[domain] ?? null;
  }, [email]);

  return (
    <>
      <InputField
        type="email"
        placeholder={t("EMAIL")}
        {...register("email")}
        successText={successText ? t(successText) : undefined}
        errorText={errors.email && t(`ERRORS.${errors.email.message}`)}
        autoComplete="email"
        focusOnMount
      />

      {successText && emailProviderLink && (
        <p className="text-sm text-gray-600 mt-2">
          {t("CHECK_YOUR_EMAIL")}{" "}
          <a
            href={emailProviderLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {emailProviderLink.name}
          </a>
        </p>
      )}
    </>
  );
}