import { useTranslations } from "next-intl";

interface NonFieldErrorsProps {
  errors: Partial<{
    type: string | number;

    message: string;
  }> &
    Record<string, Partial<{ type: string | number; message: string }>>;
}

export default function RootErrors({ errors }: NonFieldErrorsProps) {
  const t = useTranslations("AUTH");

  if (!errors?.message) return null;

  return <p className="text-invalid text-shadow-md">{t(`ERRORS.${errors.message}`)}</p>;
}