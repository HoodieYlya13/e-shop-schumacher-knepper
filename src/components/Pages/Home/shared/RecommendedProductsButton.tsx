'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/UI/shared/elements/Button';

interface RecommendedProductsButtonProps {
  areRecommendedProducts?: boolean;
}

export default function RecommendedProductsButton({
  areRecommendedProducts,
}: RecommendedProductsButtonProps) {
  const t = useTranslations("HOME_PAGE");

  return (
    <Button
      variant="starborder"
      onClick={() => {
        document.getElementById("best-sellers")?.scrollIntoView({
          behavior: "smooth",
        });
      }}
      child={areRecommendedProducts ? t("BEST_SELLERS") : t("ALL_PRODUCTS")}
      primary={false}
    />
  );
}