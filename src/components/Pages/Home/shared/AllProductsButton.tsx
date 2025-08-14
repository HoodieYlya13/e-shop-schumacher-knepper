'use client';

import { useTranslations } from 'next-intl';
import StarBorder from '@/components/UI/shared/elements/StarBorder';

export default function AllProductsButton() {
  const t = useTranslations("HOME_PAGE");

  return (
    <StarBorder
      as="button"
      onClick={() => {
        document.getElementById("best-sellers")?.scrollIntoView({
          behavior: "smooth",
        });
      }}
      className="bg-gradient-to-b from-black to-secondary"
      color="var(--accent-color)"
    >
      { t('BEST_SELLERS') }
    </StarBorder>
  );
}