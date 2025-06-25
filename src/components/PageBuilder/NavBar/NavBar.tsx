'use client';

import LanguageSwitcher from "./LanguageSwitcher";
import Navigation from "./Navigation";

export default function NavBar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <Navigation />
      <LanguageSwitcher />
    </header>
  );
}