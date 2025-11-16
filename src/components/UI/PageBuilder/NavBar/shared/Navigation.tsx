'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useEffect } from 'react';
import Logout from './Logout';
import Button from '@/components/UI/shared/elements/Button';

function MyAccountIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
    </svg>
  );
}

const navItemsBase = [
  { href: '/', labelKey: 'NAV.HOME' },
  { href: '/products', labelKey: 'NAV.PRODUCTS' },
];

interface NavigationProps {
  customerAccessToken: string | undefined;
  onClickLink?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function Navigation({ customerAccessToken, onClickLink }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();

  const isLoggedIn = !!customerAccessToken;

  useEffect(() => {
    if (pathname.startsWith('/auth') && isLoggedIn) router.replace('/account');
    else if (pathname.startsWith('/account') && !isLoggedIn) router.replace('/auth');
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
          <div className="flex flex-row gap-4" key={href}>
            <Button
              href={href}
              onClickLink={onClickLink}
              className={clsx("opacity-80 hover:opacity-100", {
                "text-accent": isActive,
              })}
              child={
                labelKey === "NAV.ACCOUNT" ? <MyAccountIcon /> : t(labelKey)
              }
              oneLiner
            />
            {labelKey === "NAV.ACCOUNT" && customerAccessToken && <Logout />}
          </div>
        );
      })}
    </nav>
  );
}