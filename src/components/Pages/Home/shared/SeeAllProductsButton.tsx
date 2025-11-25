'use client';

import { useRouter } from "next/navigation";
import Button from '@/components/UI/shared/elements/Button';
import { useTranslations } from "next-intl";

export default function SeeAllProductsButton() {
  const router = useRouter();
  const t = useTranslations("HOME_PAGE");

  return (
    <Button
      onClick={() => router.push("/products")}
      child={t("ALL_PRODUCTS")}
      primary={false}
    />
  );
}