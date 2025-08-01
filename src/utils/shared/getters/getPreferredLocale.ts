import { getServerCookie } from "./shared/getServerCookie";

export async function getPreferredLocale(toUpperCase = false) {
  const locale = await getServerCookie("preferred_locale");
  return toUpperCase ? locale?.toUpperCase() : locale;
}