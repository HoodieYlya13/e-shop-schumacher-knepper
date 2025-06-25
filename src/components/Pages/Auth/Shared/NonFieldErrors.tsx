import { useTranslations } from "next-intl";

interface NonFieldErrorsProps {
  apiErrors: Record<string, string>;
}

export default function NonFieldErrors({ apiErrors }: NonFieldErrorsProps) {
  const t = useTranslations("AUTH");

  return (
    <>
      {Object.entries(apiErrors).map(([key, value]) => (
        <p key={key} className="text-red-600">
          {t(`ERRORS.${value}`)}
        </p>
      ))}
    </>
  );
}