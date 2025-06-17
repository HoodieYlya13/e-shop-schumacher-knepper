'use client';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();

  const switchTo = (locale: string) => {
    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className="space-x-2">
      <button onClick={() => switchTo('fr')}>Français</button>
      <button onClick={() => switchTo('en')}>English</button>
      <button onClick={() => switchTo('de')}>Deutsch</button>
    </div>
  );
}