'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useEffect } from 'react';
import Logout from './Logout';

const navItemsBase = [
  { href: '/', labelKey: 'NAV.HOME' },
  { href: '/products', labelKey: 'NAV.PRODUCTS' },
];

interface NavigationProps {
  customerAccessToken: string | undefined;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Navigation({ customerAccessToken, setShowMenu }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();

  const isLoggedIn = !!customerAccessToken;

  useEffect(() => {
    if (pathname.startsWith('/auth') && isLoggedIn) {
      router.replace('/account');
    } else if (pathname.startsWith('/account') && !isLoggedIn) {
      router.replace('/auth');
    }
  }, [pathname, router, isLoggedIn]);

  const navItems = [
    ...navItemsBase,
    isLoggedIn
      ? { href: '/account', labelKey: 'NAV.ACCOUNT' }
      : { href: '/auth', labelKey: 'NAV.ACCOUNT' },
  ];

  return (
    <nav className="flex flex-col md:flex-row gap-4">
      {navItems.map(({ href, labelKey }) => {
        const localeRegex = /^\/[a-z]{2}(?=\/|$)/;
        const normalizedPath = pathname.replace(localeRegex, "") || "/";
        const isActive =
          href === "/"
            ? normalizedPath === "/"
            : normalizedPath.startsWith(href);

        return (
          <div className="flex flex-row gap-4 itmes-center" key={href}>
            <Link
              href={href}
              onClick={() => setShowMenu(false)}
              className={clsx(
                "rounded transition hover:scale-110 duration-300 text-outline",
                isActive && "text-accent"
              )}
            >
              {t(labelKey)}
            </Link>
            {(href === "/account" || href === "/auth") &&
              customerAccessToken && <Logout />}
          </div>
        );
      })}
    </nav>
  );
}