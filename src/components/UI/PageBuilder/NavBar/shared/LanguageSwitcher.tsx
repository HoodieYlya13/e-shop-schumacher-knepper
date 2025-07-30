'use client';

import { defaultLocale, LocaleLanguages } from '@/i18n/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LanguageSwitcherProps {
  storedLocale?: LocaleLanguages;
}

export default function LanguageSwitcher({ storedLocale = defaultLocale }: LanguageSwitcherProps) {
  const router = useRouter();

  const switchTo = (locale: string) => {
    document.cookie = `preferred_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    const currentLocale = pathname.split('/')[1];

    if (
      storedLocale &&
      storedLocale !== currentLocale
    ) {
      const segments = pathname.split('/');
      segments[1] = storedLocale;
      router.replace(segments.join('/'));
    }
  }, [router, storedLocale]);

  return (
    <div className="space-x-2">
      <button onClick={() => switchTo('fr')}>Français</button>
      <button onClick={() => switchTo('en')}>English</button>
      <button onClick={() => switchTo('de')}>Deutsch</button>
    </div>
  );
}