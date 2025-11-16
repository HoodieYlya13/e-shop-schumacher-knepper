'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import Button from '../../../shared/elements/Button';

const navDomain = [
  { href: '/delivery', labelKey: 'NAV.DELIVERY' },
  { href: '/general-terms', labelKey: 'NAV.GENERAL_TERMS' },
  { href: '/about-us', labelKey: 'NAV.ABOUT_US' },
];

export default function DomainNavigation() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav className="flex flex-col gap-1">
      {navDomain.map(({ href, labelKey }) => {
        const localeRegex = /^\/[a-z]{2}(?=\/|$)/;
        const normalizedPath = pathname.replace(localeRegex, "") || "/";
        const isActive =
          href === "/"
            ? normalizedPath === "/"
            : normalizedPath.startsWith(href);

        return (
          <Button
            href={href}
            key={href}
            className={clsx(
              "opacity-80 hover:opacity-100 w-fit",
              isActive && "text-accent"
            )}
            child={t(labelKey)}
            oneLiner
          />
        );
      })}
    </nav>
  );
}