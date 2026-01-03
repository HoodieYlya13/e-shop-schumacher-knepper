import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_UPPERCASE,
  LocaleLanguages,
  LocaleLanguagesUpperCase,
} from "@/i18n/utils";
import { getServerCookie } from "./shared/getServerCookie";

export async function getPreferredLocale(toUpperCase = false) {
  const locale = await getServerCookie("preferred_locale");
  return toUpperCase
    ? ((locale?.toUpperCase() ||
        DEFAULT_LOCALE_UPPERCASE) as LocaleLanguagesUpperCase)
    : ((locale || DEFAULT_LOCALE) as LocaleLanguages);
}
