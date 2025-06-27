import { useTranslations } from "next-intl";

interface NonFieldErrorsProps {
  errors: Partial<{
    type: string | number;

    message: string;
  }> &
    Record<string, Partial<{ type: string | number; message: string }>>;
}

export default function NonFieldErrors({ errors }: NonFieldErrorsProps) {
  const t = useTranslations("AUTH");

  if (!errors?.message) return null;

  if (
    errors.message === "LOGIN_ERROR" ||
    errors.message === "GENERIC" ||
    errors.message === "UNIDENTIFIED_CUSTOMER"
  ) {
    return <p className="text-red-600">{t(`ERRORS.${errors.message}`)}</p>;
  }

  return null;
}