'use client';

import { getPreferredLocale } from '@/utils/shared/getters/getPreferredLocale';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LanguageSwitcher() {
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
    const storedLocale = getPreferredLocale();
    const pathname = window.location.pathname;
    const currentLocale = pathname.split('/')[1];

    if (
      storedLocale &&
      storedLocale !== currentLocale &&
      ['fr', 'en', 'de'].includes(storedLocale)
    ) {
      const segments = pathname.split('/');
      segments[1] = storedLocale;
      router.replace(segments.join('/'));
    }
  }, [router]);

  return (
    <div className="space-x-2">
      <button onClick={() => switchTo('fr')}>Français</button>
      <button onClick={() => switchTo('en')}>English</button>
      <button onClick={() => switchTo('de')}>Deutsch</button>
    </div>
  );
}