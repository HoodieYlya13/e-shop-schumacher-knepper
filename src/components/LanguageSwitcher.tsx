'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();

  const switchTo = (locale: string) => {
    localStorage.setItem('preferred-locale', locale);

    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  useEffect(() => {
    const storedLocale = localStorage.getItem('preferred-locale');
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