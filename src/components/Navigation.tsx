'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

const navItems = [
  { href: '/', labelKey: 'NAV.HOME' },
  { href: '/about', labelKey: 'NAV.ABOUT' },
];

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations();
  const strippedPathname = pathname.split('/').slice(2).join('/') || '/';

  return (
    <nav className="flex gap-4 p-4 border-b bg-white shadow-sm">
      {navItems.map(({ href, labelKey }) => {
        const isActive = href === '/' ? strippedPathname === '/' : strippedPathname.startsWith(href.slice(1));

        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'px-4 py-2 rounded hover:bg-gray-100 transition',
              isActive && 'bg-gray-200 font-semibold'
            )}
          >
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}