import { useTranslations } from "next-intl";
import Input from "../../../UI/shared/elements/Input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { PasswordRecoveryValue } from "@/schemas/authSchema";
import { useMemo } from "react";
import Button from "@/components/UI/shared/elements/Button";

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

    const domainParts = email.split("@")[1]?.toLowerCase().split(".");
    if (!domainParts || domainParts.length < 2) return null;

    const tld = domainParts.slice(1).join(".");
    const providerName = domainParts[0];

    const map: Record<
      string,
      { name: string; url?: string; getUrl?: (tld: string) => string }
    > = {
      gmail: { name: "Gmail", url: "https://mail.google.com" },
      yahoo: {
        name: "Yahoo Mail",
        getUrl: (tld) => `https://mail.yahoo.${tld}`,
      },
      hotmail: { name: "Outlook", url: "https://outlook.live.com" },
      outlook: { name: "Outlook", url: "https://outlook.live.com" },
      live: { name: "Outlook", url: "https://outlook.live.com" },
      icloud: { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
      orange: {
        name: "Orange Mail",
        getUrl: (tld) => `https://messagerie.orange.${tld}`,
      },
      sfr: { name: "SFR Mail", getUrl: (tld) => `https://webmail.sfr.${tld}` },
      laposte: {
        name: "La Poste Mail",
        url: "https://www.laposte.net/accueil",
      },
      free: {
        name: "Free Mail",
        getUrl: (tld) => `https://webmail.free.${tld}`,
      },
      proton: {
        name: "Proton Mail",
        url: "https://account.proton.me/",
      },
    };

    const provider = map[providerName];
    if (!provider) return null;

    return {
      name: provider.name,
      url: provider.getUrl ? provider.getUrl(tld) : provider.url!,
    };
  }, [email]);

  return (
    <>
      <Input
        type="email"
        label={t("EMAIL")}
        requiredTag={false}
        {...register("email")}
        successText={successText ? t(successText) : undefined}
        errorText={errors.email && t(`ERRORS.${errors.email.message}`)}
        autoComplete="email"
        focusOnMount
      />

      {successText && emailProviderLink && (
        // TODO maybe a lighter color?
        <p className="text-sm text-dark mt-2">
          {t("CHECK_YOUR_EMAIL")}{" "}
          <Button
            href={emailProviderLink.url}
            target="_blank"
            className="text-accent"
            child={emailProviderLink.name}
            underline
          />
        </p>
      )}
    </>
  );
}