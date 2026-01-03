'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import Button from '../../../shared/elements/Button';

interface IconProps {
  variant: 'delivery' | 'general_terms' | 'about_us';
}

function Icon({ variant }: IconProps) {
  function renderPath() {
    switch (variant) {
      case "delivery":
        return (
          <path d="M280-160q-50 0-85-35t-35-85H60l18-80h113q17-19 40-29.5t49-10.5q26 0 49 10.5t40 29.5h167l84-360H182l4-17q6-28 27.5-45.5T264-800h456l-37 160h117l120 160-40 200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H400q0 50-35 85t-85 35Zm357-280h193l4-21-74-99h-95l-28 120Zm-19-273 2-7-84 360 2-7 34-146 46-200ZM20-427l20-80h220l-20 80H20Zm80-146 20-80h260l-20 80H100Zm180 333q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm400 0q17 0 28.5-11.5T720-280q0-17-11.5-28.5T680-320q-17 0-28.5 11.5T640-280q0 17 11.5 28.5T680-240Z" />
        );
      case "general_terms":
        return (
          <path d="M240-80q-50 0-85-35t-35-85v-120h120v-560h600v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-600H320v480h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h360v80H360Zm0 120v-80h360v80H360ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm0 0h-40 400-360Z" />
        );
      case "about_us":
        return (
          <path d="M360-160q-19 0-36-8.5T296-192L80-480l216-288q11-15 28-23.5t36-8.5h440q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H360ZM180-480l180 240h440v-480H360L180-480Zm220 40q17 0 28.5-11.5T440-480q0-17-11.5-28.5T400-520q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440Zm140 0q17 0 28.5-11.5T580-480q0-17-11.5-28.5T540-520q-17 0-28.5 11.5T500-480q0 17 11.5 28.5T540-440Zm140 0q17 0 28.5-11.5T720-480q0-17-11.5-28.5T680-520q-17 0-28.5 11.5T640-480q0 17 11.5 28.5T680-440Zm-100-40Z" />
        );
      default:
        return null;
    }
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      {renderPath()}
    </svg>
  );
}

const navDomain: {
  href: string;
  labelKey: string;
  variant: "delivery" | "general_terms" | "about_us";
}[] = [
  { href: "/delivery", labelKey: "NAV.DELIVERY", variant: "delivery" },
  {
    href: "/general-terms",
    labelKey: "NAV.GENERAL_TERMS",
    variant: "general_terms",
  },
  { href: "/about-us", labelKey: "NAV.ABOUT_US", variant: "about_us" },
];

export default function DomainNavigation() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav className="flex flex-col gap-1 font-normal pl-1 md:pl-2">
      {navDomain.map(({ href, labelKey, variant }) => {
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
            child={
              <div className="inline-flex gap-1">
                <Icon variant={variant} />
                {t(labelKey)}
              </div>
            }
            oneLiner
          />
        );
      })}
    </nav>
  );
}