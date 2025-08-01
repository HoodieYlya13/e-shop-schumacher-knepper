import { getCookie } from "./getCookie";

export async function getPreferredLocale(toUpperCase = false) {
  const locale = await getCookie("preferred_locale");
  return toUpperCase ? locale?.toUpperCase() : locale;
}