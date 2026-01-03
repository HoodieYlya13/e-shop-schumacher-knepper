"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setClientCookie } from "@/utils/shared/setters/shared/setClientCookie";
import { LocaleLanguages } from "@/i18n/utils";

interface LocaleMismatchProps {
  locale: LocaleLanguages;
  localeMismatch: string;
}

export default function LocaleMismatch({
  locale,
  localeMismatch,
}: LocaleMismatchProps) {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  if (!isVisible) return null;

  const handleSwitch = () => {
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;

    const segments = pathname.split("/");
    segments[1] = localeMismatch;
    const newPath = segments.join("/") + search + hash;

    // Update the preferred_locale cookie to the new choice
    setClientCookie("preferred_locale", localeMismatch as LocaleLanguages, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "Lax",
    });

    // Clear the mismatch cookie so it doesn't trigger again immediately
    setClientCookie("locale_mismatch", "", {
      path: "/",
      maxAge: 0,
      sameSite: "Lax",
    });

    router.push(newPath);
  };

  const handleStay = () => {
    setIsVisible(false);
    // Update preference to current locale so we don't ask again
    setClientCookie("preferred_locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "Lax",
    });
    // Clear the mismatch cookie
    setClientCookie("locale_mismatch", "", {
      path: "/",
      maxAge: 0,
      sameSite: "Lax",
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white p-6 rounded-xl shadow-2xl border border-gray-100 flex flex-col gap-4 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg text-gray-900">
          Switch Language?
        </h3>
        <p className="text-sm text-gray-600">
          We detected that your preferred language is{" "}
          <span className="font-medium text-gray-900 uppercase">
            {localeMismatch}
          </span>
          , but you are viewing the site in{" "}
          <span className="font-medium text-gray-900 uppercase">{locale}</span>.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleStay}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Keep {locale.toUpperCase()}
        </button>
        <button
          onClick={handleSwitch}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors shadow-sm"
        >
          Switch to {localeMismatch.toUpperCase()}
        </button>
      </div>
    </div>
  );
}