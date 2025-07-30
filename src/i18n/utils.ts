import en from 'react-phone-number-input/locale/en';
import fr from 'react-phone-number-input/locale/fr';
import de from 'react-phone-number-input/locale/de';

const rawLabels = { fr, en, de } as const;
export const SUPPORTED_LOCALES = Object.keys(rawLabels) as Array<keyof typeof rawLabels>;

export type LocaleLanguages = typeof SUPPORTED_LOCALES[number];
export type LocaleLanguagesUpperCase = Uppercase<LocaleLanguages>;

export const defaultLocale: LocaleLanguages = 'en';
export const defaultLocaleUpperCase: LocaleLanguagesUpperCase = defaultLocale.toUpperCase() as LocaleLanguagesUpperCase;


export function getPhoneInputLabels(): (typeof rawLabels)[typeof defaultLocale] {
  const resolvedLocale = getPreferredLocaleClientSide() as LocaleLanguages;
  return rawLabels[resolvedLocale];
}

export function getPreferredLocaleClientSide(toUpperCase = false): LocaleLanguages | LocaleLanguagesUpperCase {
  if (typeof document === "undefined")
    return toUpperCase
      ? (defaultLocale.toUpperCase() as LocaleLanguagesUpperCase)
      : defaultLocale;

  const preferredLocale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("preferred_locale="))
    ?.split("=")[1] as LocaleLanguages;

  const locale = SUPPORTED_LOCALES.includes(preferredLocale)
    ? preferredLocale
    : defaultLocale;

  return toUpperCase
    ? (locale.toUpperCase() as LocaleLanguagesUpperCase)
    : locale;
}