'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/utils/account/getAccessToken';

const navItemsBase = [
  { href: '/', labelKey: 'NAV.HOME' },
  { href: '/about', labelKey: 'NAV.ABOUT' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {    
    const token = getAccessToken();
    setIsLoggedIn(!!token);

    if (pathname.startsWith('/auth') && token) {
      router.replace('/account');
    } else if (pathname.startsWith('/account') && !token) {
      router.replace('/auth');
    }
  }, [pathname, router]);

  const navItems = [
    ...navItemsBase,
    isLoggedIn
      ? { href: '/account', labelKey: 'NAV.ACCOUNT' }
      : { href: '/auth', labelKey: 'NAV.ACCOUNT' },
  ];

  return (
    <nav className="flex gap-4 p-4 border-b bg-white shadow-sm">
      {navItems.map(({ href, labelKey }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

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