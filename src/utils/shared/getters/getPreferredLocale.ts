import { LocaleLanguages, LocaleLanguagesUpperCase } from "@/i18n/utils";
import { getServerCookie } from "./shared/getServerCookie";

export async function getPreferredLocale(toUpperCase = false) {
  const locale = await getServerCookie("preferred_locale");
  return toUpperCase
    ? ((locale?.toUpperCase() || "EN") as LocaleLanguagesUpperCase)
    : ((locale || "en") as LocaleLanguages);
}