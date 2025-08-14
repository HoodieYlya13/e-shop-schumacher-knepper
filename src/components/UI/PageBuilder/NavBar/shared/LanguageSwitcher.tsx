'use client';

import { defaultLocale, LocaleLanguages } from '@/i18n/utils';
import { setClientCookie } from '@/utils/shared/setters/shared/setClientCookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface LanguageSwitcherProps {
  storedLocale?: LocaleLanguages;
}

export default function LanguageSwitcher({ storedLocale = defaultLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const switchTo = (locale: LocaleLanguages) => {
    setClientCookie("preferred_locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "Lax",
    });

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAll && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowAll(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAll]);

  const languages = [
    { code: 'fr', img: 'FR.svg', alt: 'French' },
    { code: 'en', img: 'EN.svg', alt: 'English' },
    { code: 'de', img: 'DE.svg', alt: 'Deutsch' },
  ];

  return (
    <div className="space-x-2 flex" ref={wrapperRef}>
      {!showAll ? (
        languages.filter(({ code }) => code === storedLocale).map(({ code, img, alt }) => (
          <button key={code} onClick={() => setShowAll(true)}>
            <Image
              src={`/img/flags/${img}`}
              width={24}
              height={16}
              alt={alt}
              className="cursor-pointer border hover:scale-110 transition-transform duration-300"
            />
          </button>
        ))
      ) : (
        languages.map(({ code, img, alt }) => (
          <button key={code} onClick={() => { switchTo(code as LocaleLanguages); setShowAll(false); }}>
            <Image
              src={`/img/flags/${img}`}
              width={24}
              height={16}
              alt={alt}
              className="cursor-pointer border hover:scale-110 transition-transform duration-300"
            />
          </button>
        ))
      )}
    </div>
  );
}